import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.EMAIL_USER ,
        pass:process.env.EMAIL_PASS
    }
})


// export const sendOrderPaidEmail = async(buyerEmail:string,orderId:string) => {
//     await transporter.sendMail({
//         from :`"AtlasTech" <${process.env.EMAIL_USER}>`,
//         to:buyerEmail,
//         subject:`Your order ${orderId} is paid`,
//         text:`HIII ! Your order ${orderId} has been successfully paid`,
//         html:`<p>HI </p> <p>Your Order <strong>${orderId}</strong> has been successfully paid</p><p> you can download your invoise <a href="${process.env.CLIENT_URL}/${orderId}/invoice">here</a></p>`
//     })
// }





export const sendOrderPaidEmail = async (buyerEmail: string, orderId: string) => {
  await transporter.sendMail({
    from: `"AtlasTech" <${process.env.EMAIL_USER}>`,
    to: buyerEmail,
    subject: `Your order #${orderId} is successfully paid `,
    text: `Hello! 

Your order #${orderId} has been successfully paid. 

You can download your invoice here: ${process.env.CLIENT_URL}/${orderId}/invoice

Thank you for shopping with AtlasTech!`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #2E86C1; text-align: center;">Thank You for Your Order!</h2>
      <p style="font-size: 16px; color: #333;">Hi there,</p>
      <p style="font-size: 16px; color: #333;">
        Your order <strong>#${orderId}</strong> has been <span style="color: green;">successfully paid</span>.
      </p>

      <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
        <p style="margin: 0; font-size: 16px;">You can download your invoice by clicking the button below:</p>
        <a href="${process.env.CLIENT_URL}/${orderId}/invoice" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #2E86C1; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Download Invoice
        </a>
      </div>

      <p style="font-size: 16px; color: #333;">
        Thank you for choosing <strong>AtlasTech</strong>. We hope you enjoy your purchase!
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #2E86C1;">${process.env.EMAIL_USER}</a>.
      </p>
    </div>
    `
  });
}
