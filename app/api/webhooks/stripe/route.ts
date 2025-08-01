import { NextRequest } from 'next/server';
// Update the import path if the file is located elsewhere, for example:
// import { stripe } from '@/lib/stripe';
// Or create the file at 'app/lib/stripe.ts' with the following content:
// import Stripe from 'stripe';
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge;

    await updateOrderToPaid({
      orderId: charge.metadata.orderId,
      paymentResult: {
        id: charge.id,
        status: 'COMPLETED',
        email_address: charge.billing_details.email!,
        pricePaid: (charge.amount / 100).toFixed(),
      },
    });

    return new Response('updateOrderToPaid was successful', { status: 200 });
  }

  return new Response('event is not charge.succeeded', { status: 200 });
}
