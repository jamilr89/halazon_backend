import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"

type Options = {
  region: string
  access_key_id: string
  secret_access_key: string
  from: string
}

export class SesNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-ses"
  protected client_: SESv2Client
  protected from_: string

  constructor(_deps: Record<string, unknown>, options: Options) {
    super()
    this.from_ = options.from
    this.client_ = new SESv2Client({
      region: options.region,
      credentials: {
        accessKeyId: options.access_key_id,
        secretAccessKey: options.secret_access_key,
      },
    })
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { subject, html, text } = notification.content ?? {}
    if (!subject || (!html && !text)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Notification needs content.subject and content.html or content.text"
      )
    }

    const result = await this.client_.send(
      new SendEmailCommand({
        FromEmailAddress: this.from_,
        Destination: { ToAddresses: [notification.to] },
        Content: {
          Simple: {
            Subject: { Data: subject },
            Body: {
              ...(html && { Html: { Data: html } }),
              ...(text && { Text: { Data: text } }),
            },
          },
        },
      })
    )

    return { id: result.MessageId ?? "" }
  }
}