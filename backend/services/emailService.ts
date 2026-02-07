import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.EMAIL_USER ,
        pass:process.env.EMAIL_PASS
    }
})


export const sendOrderPaidEmail = async(buyerEmail:string,orderId:string) => {
    await transporter.sendMail({
        from :`"AtlasTech" <${process.env.EMAIL_USER}>`,
        to:buyerEmail,
        subject:`Your order ${orderId} is paid`,
        text:`HIII ! Your order ${orderId} has been successfully paid`,
        html:`<p>HI </p> <p>Your Order <strong>${orderId}</strong> has been successfully paid</p><p> you can download your invoise <a href="${process.env.CLIENT_URL}/${orderId}/invoice">here</a></p>`
    })
}