import emailjs from "@emailjs/browser";
import { useState } from "react";

import AnimatedTitle from "./AnimatedTitle";

const RECEIVER_EMAIL = "aryanydv223@gmail.com";

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black/70 px-4 py-3 font-general text-sm text-blue-50 outline-none transition-colors focus:border-blue-75 md:text-base";

const normalizeEnvValue = (value) =>
  typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : "";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} alt="" />
  </div>
);

const Contact = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const serviceId = normalizeEnvValue(import.meta.env.VITE_EMAILJS_SERVICE_ID);
  const templateId = normalizeEnvValue(import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
  const publicKey = normalizeEnvValue(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!serviceId || !templateId || !publicKey) {
      setStatus("Email service is not configured. Add EmailJS keys in .env.");
      return;
    }

    try {
      setIsSending(true);
      setStatus("");

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: RECEIVER_EMAIL,
          from_email: senderEmail,
          reply_to: senderEmail,
          message,
        },
        {
          publicKey,
        }
      );

      setStatus("Message sent successfully.");
      setSenderEmail("");
      setMessage("");
    } catch (error) {
      const details =
        error?.text || error?.message || "Unknown EmailJS error. Check keys.";
      setStatus(`Failed to send message: ${details}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox src="/img/contact-1.webp" clipClass="contact-clip-path-1" />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 translate-y-60 lg:translate-y-40"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox src="/img/swordman-partial.webp" clipClass="absolute md:scale-125" />
          <ImageClipBox src="/img/swordman.webp" clipClass="sword-man-clip-path md:scale-125" />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
          <p className="mb-10 font-general text-xs uppercase">Contact Us</p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
            containerClass="special-font w-full !text-5xl !font-black !leading-[.9] !md:text-[6.2rem]"
          />

          <form
            onSubmit={handleSubmit}
            className="mt-10 w-full space-y-4 rounded-2xl border border-white/20 bg-black/60 p-5 text-left md:p-6"
          >
            <label className="block">
              <span className="mb-2 block font-general text-sm uppercase text-blue-50/80 md:text-base">
                Your Gmail ID
              </span>
              <input
                type="email"
                className={inputClass}
                placeholder="you@gmail.com"
                value={senderEmail}
                onChange={(event) => setSenderEmail(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-general text-sm uppercase text-blue-50/80 md:text-base">
                Message
              </span>
              <textarea
                className={`${inputClass} min-h-40 resize-y`}
                placeholder="Write your message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-full bg-yellow-300 px-6 py-3 font-general text-sm uppercase text-black transition-opacity disabled:opacity-60 md:text-base"
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <p className="font-circular-web text-sm text-blue-75 md:text-base">
                {status}
              </p>
            )}

            <p className="font-circular-web text-xs text-blue-50/60 md:text-sm">
              Messages are delivered to: {RECEIVER_EMAIL}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
