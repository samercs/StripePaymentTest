using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace StripeTest.Controllers
{
    [Route("stripe")]
    public class StripeController : Controller
    {
        [Route("create-payment-intent")]
        [HttpPost]
        public IActionResult CrerateIntentPayment()
        {
            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
            {
                Amount = 1400,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            });

            return Json(new { clientSecret = paymentIntent.ClientSecret });
        }

        [Route("~/success")]
        public IActionResult Success(string payment_intent, string payment_intent_client_secret, string redirect_status)
        {
            if (redirect_status.Equals("succeeded"))
            {
                //check payment intent
                var service = new PaymentIntentService();
                var result = service.Get(payment_intent);
                if (result?.Status.Equals("succeeded") ?? false)
                {
                    ViewBag.Status = "Yes";
                    return View();
                }
            }

            ViewBag.Status = "No";
            return View();
        }

        
    }
}
