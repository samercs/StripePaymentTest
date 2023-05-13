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
    }
}
