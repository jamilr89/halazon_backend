// src/subscribers/order-placed.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "items.*",
      "shipping_address.*",
    ],
    filters: { id: data.id },
  })

await notificationService.createNotifications({
  to: order.email,
  channel: "email",
  template: "order-placed", // required by Medusa, not used by this provider
  content: {
    subject: `Order #${order.display_id} confirmed`,
    html: `<h1>Thanks for your order!</h1>
           <p>Order #${order.display_id}, total ${order.total} ${order.currency_code.toUpperCase()}.</p>`,
  },
})
}

export const config: SubscriberConfig = {
  event: "order.placed",
}