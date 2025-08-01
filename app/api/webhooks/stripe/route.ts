import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Check for successful payment
  if (event.type === 'charge.succeeded') {
    const { object } = event.data;

    // Update order status
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: 'COMPLETED',
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    });
  }

  return NextResponse.json({
    message: 'event is not charge.succeeded',
  });
}
