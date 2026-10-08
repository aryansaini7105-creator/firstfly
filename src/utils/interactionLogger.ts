// Client-side non-blocking interaction logger for FirstFly Owner Desk
export interface LogInteractionPayload {
  type:
    | 'callback_5min'
    | 'booking_quote'
    | 'direct_call'
    | 'whatsapp_click'
    | 'ai_concierge_chat'
    | 'fare_calculated';
  customerPhone?: string;
  customerName?: string;
  details?: string;
  route?: string;
  vehicle?: string;
}

export async function logInteraction(payload: LogInteractionPayload): Promise<void> {
  try {
    await fetch('/api/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Fail-safe, non-blocking for user
    console.debug('Interaction log error:', err);
  }
}
