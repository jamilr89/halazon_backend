import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { SesNotificationProviderService } from "./service"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [SesNotificationProviderService],
})