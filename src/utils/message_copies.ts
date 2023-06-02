export const MessageCopies = {
  otp: (code) =>
    `Thank you for choosing Dropin. Do not share your code with anyone else. Your 4-digits OTP is ${code}`,
  driver_registration: (name) =>
    `Welcome ${name} to Dropin Ghana. You have been given one month free access to the Dropin Driver App.\nThanks for choosing us`,
  rider_registration: (name) =>
    `Welcome ${name} to Dropin Ghana. Enjoy comfortable rides on Dropin.\nThanks for choosing us`,
  data_sms: () =>
    `You have been gifted data from Dropin Ghana.\nThanks for choosing us`,
  block_driver: (name) =>
    `Hello ${name} you have being blocked from using the Dropin Driver app. Reach out to the admin on +233556906101 | +233593261052 to resolve the issues.`,
  unblock_driver: (name) =>
    `Hello ${name} you have given back access to the Dropin Driver app.`,
  driver_subscription: (name) =>
    `Hello ${name} your monthly subscription to the Dropin Driver app ends today. Open the app and complete payment to continue using the app.`,
  approve_driver: (name) =>
    `Hello ${name}, you have been approved to use the Dropin Driver app. The hottest ride hailing app in Ghana.\nThanks for choosing us`,
  promo_driver: (name) =>
    `Hello ${name}, you have been given one month free access to the Dropin Driver App.\nThanks for choosing us`,
};
