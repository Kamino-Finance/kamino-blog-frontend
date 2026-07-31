import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heading } from '../ui/atoms'
import { MailIcon, CheckIcon, ArrowRightIcon } from '../../design/icons'
import { ENTER_EASE } from '../../design/motion'

/**
 * Newsletter sign-up.
 *
 * The submit handler is a documented STUB — it validates the address and shows
 * the success state, but does not call a provider. At handoff, replace
 * `submitEmail` with a POST to your ESP (Loops / Customer.io / etc.); the UI
 * states (idle → submitting → success/error) are already wired.
 */
async function submitEmail(_email: string): Promise<void> {
  // TODO(handoff): POST to the newsletter provider here.
  await new Promise((resolve) => setTimeout(resolve, 650))
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      await submitEmail(email)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      className="relative overflow-hidden rounded-[22px] border-[0.5px] border-border px-[28px] py-[44px] sm:px-[48px] sm:py-[56px]"
      style={{
        background:
          'radial-gradient(120% 140% at 100% 0%, color-mix(in srgb, var(--base-secondary) 12%, var(--base-background)) 0%, var(--base-background) 60%)',
      }}
    >
      <div className="relative mx-auto flex max-w-[560px] flex-col items-center text-center">
        <span
          className="mb-[18px] inline-flex h-[44px] w-[44px] items-center justify-center rounded-full text-secondary"
          style={{ background: 'color-mix(in srgb, var(--base-secondary) 12%, transparent)' }}
        >
          <MailIcon size={22} />
        </span>
        <Heading as="h2" scale="feature">
          Get Kamino in your inbox
        </Heading>
        <p className="mt-[10px] max-w-[42ch] text-[15px] leading-[1.55] text-muted-foreground">
          New posts on product, partners, and the mechanics of onchain finance — a few times a month, no noise.
        </p>

        <div className="mt-[26px] w-full">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: ENTER_EASE }}
                className="inline-flex items-center gap-[9px] rounded-full border-[0.5px] border-border bg-background px-[18px] py-[12px] text-[14.5px] font-medium text-foreground"
              >
                <span className="inline-flex h-[20px] w-[20px] items-center justify-center rounded-full bg-success text-background">
                  <CheckIcon size={13} strokeWidth={2.4} />
                </span>
                You’re on the list — check your inbox to confirm.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-auto flex w-full max-w-[440px] flex-col gap-[10px] sm:flex-row"
                noValidate
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  placeholder="you@company.com"
                  aria-label="Email address"
                  aria-invalid={status === 'error'}
                  className="h-[48px] flex-1 rounded-full border-[0.5px] border-border bg-background px-[18px] text-[15px] text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-secondary focus:shadow-focus-ring"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex h-[48px] items-center justify-center gap-[7px] rounded-full bg-foreground px-[22px] text-[15px] font-medium text-background transition-[transform,box-shadow,opacity] duration-150 ease-out hover:-translate-y-[0.5px] hover:shadow-lift active:translate-y-0 disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                  {status !== 'submitting' && <ArrowRightIcon size={16} />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="mt-[12px] h-[16px] text-[12.5px]">
            {status === 'error' ? (
              <span className="text-destructive">Enter a valid email address.</span>
            ) : (
              <span className="text-muted-foreground">No spam. Unsubscribe any time.</span>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
