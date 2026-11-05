import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
  Logger,
} from "@medusajs/framework/types"
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"

type Options = {
  region: string
  access_key_id: string
  secret_access_key: string
  from: string
}

type InjectedDependencies = {
  logger: Logger
}

export class SesNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-ses"
  protected client_: SESv2Client
  protected from_: string
  protected logger_: Logger

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()
    this.logger_ = logger
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

    try {
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

      this.logger_.info(`[SESv2] Email successfully sent to ${notification.to}. Message ID: ${result.MessageId}`)
      return { id: result.MessageId ?? "" }
    } catch (error: any) {
      this.logger_.error(`[SESv2] Failed to send email to ${notification.to}: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send email via SESv2: ${error.message}`
      )
    }
  }
}