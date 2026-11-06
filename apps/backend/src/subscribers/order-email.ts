import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function sendOrderEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  logger.info(`[Subscriber] order.placed caught for order ID: ${data.id}`)

  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService = container.resolve(Modules.ORDER)

  try {
    const order = await orderModuleService.retrieveOrder(data.id, {
      relations: ["items", "shipping_address", "customer"],
    })

    logger.info(`[Subscriber] Retrieved order email target: ${order.email}`)

    // Dispatch via Notification Module
await notificationModuleService.createNotifications({
  to: order.email,
  channel: "email",
  template: "order-placed",
  content: {
    subject: `Order Confirmation #${order.display_id}`,
    html: `<p>Thank you for your order, ${order.shipping_address?.first_name || "Customer"}!</p>`,
    text: `Thank you for your order, ${order.display_id}`,
  },
  data: {
    order,
  },
} as unknown as Parameters<typeof notificationModuleService.createNotifications>[0])

    logger.info(`[Subscriber] Notification module call completed successfully.`)
  } catch (error: any) {
    logger.error(`[Subscriber] Error handling order-placed email: ${error.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}