/* Parity Deals Script for julioct.github.io
   Description: Handles the parity deals coupon functionality
*/

(function ($)
{
    "use strict";

    // Parity Deals coupon handling
    document.addEventListener("DOMContentLoaded", function ()
    {
        // Global variable to store Parity Deals response data
        window.parityDealsInfo = {
            couponCode: "", // Default coupon code (empty - no hardcoded coupon)
            discountPercentage: "30", // Default discount percentage (no decimals)
            discountDollars: "",  // Manual default discount in dollars (not provided by API)
            country: "", // Country from Parity Deals API
            couponFromAPI: false // Flag to track if coupon code came from API
        };

        const paymentPlanContainer = document.getElementById('payment-plan-container');
        const fullPriceDiv = document.getElementById('full-price');
        const discountedPriceDiv = document.getElementById('discounted-price');
        const oneTimePaymentLink = document.getElementById('one-time-payment-link');
        const notificationBanner = document.getElementById('notification-banner');

        // Payment plan elements
        const paymentPlanLink = document.getElementById('payment-plan-link');
        const paymentPlanFullPriceDiv = document.getElementById('payment-plan-full-price');
        const paymentPlanDiscountedPriceDiv = document.getElementById('payment-plan-discounted-price');

        const originalHref = "https://learn.dotnetacademy.io/enroll/2141091?price_id=2894278";
        const originalPaymentPlanHref = "https://learn.dotnetacademy.io/enroll/2141091?price_id=3960951";
        const originalPrice = 497; // Original price in dollars
        const originalPaymentPlanPrice = 129; // Original payment plan price per month

        // Make sure banner is completely hidden by default (in case CSS doesn't do this)
        if (notificationBanner)
        {
            notificationBanner.style.display = 'none';
        }

        // Function to update notification banner with discount information
        const updateNotificationBanner = function ()
        {
            if (!notificationBanner) return;

            const discountPercentage = parseInt(window.parityDealsInfo.discountPercentage) || 0;
            const discountDollars = window.parityDealsInfo.discountDollars;
            const country = window.parityDealsInfo.country || "your country";

            // Show banner if there's any discount available (percentage or dollar amount)
            if (discountPercentage <= 0 && !discountDollars)
            {
                notificationBanner.style.display = 'none';
                return;
            }

            let discountText = "";

            // Determine whether to use percentage or dollar amount
            if (discountPercentage > 0)
            {
                discountText = `${discountPercentage}%`;
            } else
            {
                discountText = `$${discountDollars}`;
            }

            let bannerText = `📚 Back to School Sale: <strong>${discountText} OFF EVERYTHING</strong> • Ends&nbsp;September&nbsp;2`;

            // If coupon code came from the Parity Deals API, use the country-specific format
            if (window.parityDealsInfo.couponFromAPI)
            {
                bannerText = `Pricing adjusted for <strong>${country}</strong> — <strong>${discountText} OFF</strong>`;
            }

            notificationBanner.innerHTML = bannerText;
            notificationBanner.style.display = 'block';
        };

        // Function to update link with coupon code
        const updateCouponLink = function ()
        {
            // Update one-time payment link
            if (oneTimePaymentLink)
            {
                const couponCode = window.parityDealsInfo.couponCode;
                // Only apply coupon if it exists AND came from the API
                if (couponCode && window.parityDealsInfo.couponFromAPI)
                {
                    oneTimePaymentLink.href = originalHref + "&coupon=" + couponCode;
                } else
                {
                    oneTimePaymentLink.href = originalHref;
                }
            }

            // Update payment plan link
            if (paymentPlanLink)
            {
                const couponCode = window.parityDealsInfo.couponCode;
                // Only apply coupon if it exists AND came from the API
                if (couponCode && window.parityDealsInfo.couponFromAPI)
                {
                    paymentPlanLink.href = originalPaymentPlanHref + "&coupon=" + couponCode;
                } else
                {
                    paymentPlanLink.href = originalPaymentPlanHref;
                }
            }
        };

        // Function to calculate discounted price based on percentage or fixed amount
        const calculateDiscountedPrice = function (isPaymentPlan = false)
        {
            const discountPercentage = parseInt(window.parityDealsInfo.discountPercentage) || 0;
            const discountDollars = parseInt(window.parityDealsInfo.discountDollars) || 0;
            const basePrice = isPaymentPlan ? originalPaymentPlanPrice : originalPrice;
            let discountedPrice = basePrice;

            // Apply percentage discount if available, otherwise use dollar discount
            if (discountPercentage > 0)
            {
                discountedPrice = basePrice - (basePrice * discountPercentage / 100);
            } else if (discountDollars > 0 && !isPaymentPlan)
            {
                // Only apply dollar discount to one-time payment, not payment plan
                discountedPrice = basePrice - discountDollars;
            }

            // Ensure the price is not negative and round to whole number
            return Math.max(Math.round(discountedPrice), 0);
        };

        // Update discount display information
        const updateDiscountDisplay = function ()
        {
            // Update one-time payment discount display
            const discountedPriceValue = document.getElementById('discounted-price-value');
            const originalPriceSpan = document.getElementById('original-price');
            const discountAmountSpan = document.getElementById('discount-amount');

            if (discountedPriceValue && originalPriceSpan && discountAmountSpan)
            {
                const discountedPrice = calculateDiscountedPrice(false);
                const discountPercentage = parseInt(window.parityDealsInfo.discountPercentage) || 0;
                const discountDollars = parseInt(window.parityDealsInfo.discountDollars) || 0;

                // Update the discounted price
                discountedPriceValue.textContent = discountedPrice;

                // Update original price display
                originalPriceSpan.textContent = `$${originalPrice}`;

                // Determine and update the discount text
                if (discountPercentage > 0)
                {
                    discountAmountSpan.textContent = `${discountPercentage}% OFF`;
                } else
                {
                    discountAmountSpan.textContent = `$${discountDollars} OFF`;
                }
            }

            // Update payment plan discount display
            const paymentPlanDiscountedPriceValue = document.getElementById('payment-plan-discounted-price-value');
            const paymentPlanOriginalPriceSpan = document.getElementById('payment-plan-original-price');
            const paymentPlanDiscountAmountSpan = document.getElementById('payment-plan-discount-amount');

            if (paymentPlanDiscountedPriceValue && paymentPlanOriginalPriceSpan && paymentPlanDiscountAmountSpan)
            {
                const paymentPlanDiscountedPrice = calculateDiscountedPrice(true);
                const discountPercentage = parseInt(window.parityDealsInfo.discountPercentage) || 0;

                // Update the discounted price for payment plan
                paymentPlanDiscountedPriceValue.textContent = paymentPlanDiscountedPrice;

                // Update original price display for payment plan
                paymentPlanOriginalPriceSpan.textContent = `$${originalPaymentPlanPrice}`;

                // Update the discount text for payment plan (only percentage for payment plan)
                if (discountPercentage > 0)
                {
                    paymentPlanDiscountAmountSpan.textContent = `${discountPercentage}% OFF`;
                }
            }
        };

        // Function to update UI based on discount availability (regardless of coupon codes)
        const updateUI = function ()
        {
            // Check if we have any discount available (percentage or dollar amount)
            const hasDiscount = parseInt(window.parityDealsInfo.discountPercentage) > 0 ||
                window.parityDealsInfo.discountDollars;

            const hasCouponCode = !!window.parityDealsInfo.couponCode;
            const isParityDealsDiscount = window.parityDealsInfo.couponFromAPI;

            // Show/hide payment plan container based on coupon code from API
            if (paymentPlanContainer)
            {
                if (isParityDealsDiscount)
                {
                    paymentPlanContainer.style.display = 'none';
                } else
                {
                    paymentPlanContainer.style.display = 'block';
                }
            }

            // Update frequency element text based on whether payment plan is showing (like the other implementation)
            const onetimeFrequencyDivs = document.querySelectorAll('.frequency.one-time-payment');
            onetimeFrequencyDivs.forEach(div =>
            {
                if (isParityDealsDiscount)
                {
                    div.textContent = 'Lifetime Access';
                } else
                {
                    div.textContent = 'Best Value';
                }
            });

            // Update price display - show discounted price when discount is available (regardless of coupon code)
            if (fullPriceDiv && discountedPriceDiv)
            {
                fullPriceDiv.style.display = hasDiscount ? 'none' : 'block';
                discountedPriceDiv.style.display = hasDiscount ? 'block' : 'none';
            }

            // Update payment plan price display - show discounted price when discount is available
            if (paymentPlanFullPriceDiv && paymentPlanDiscountedPriceDiv)
            {
                paymentPlanFullPriceDiv.style.display = hasDiscount ? 'none' : 'block';
                paymentPlanDiscountedPriceDiv.style.display = hasDiscount ? 'block' : 'none';
            }

            // Update discount display values
            updateDiscountDisplay();

            // Update notification banner
            updateNotificationBanner();

            // Update coupon link
            updateCouponLink();
        };

        // Function to fetch coupon from Parity Deals API (only called once)
        const fetchParityCoupon = async function ()
        {
            try
            {
                const apiUrl = `https://api.paritydeals.com/api/v1/deals/discount/?url=${encodeURIComponent(window.location.href)}`;
                const response = await fetch(apiUrl);

                if (!response.ok)
                {
                    console.log("Failed to fetch coupon from Parity Deals API");
                    return;
                }

                const data = await response.json();
                console.log("Parity Deals API response:", data);

                // Store the API response globally and update UI if needed
                let uiNeedsUpdate = false;

                if (data.couponCode)
                {
                    window.parityDealsInfo.couponCode = data.couponCode;
                    window.parityDealsInfo.couponFromAPI = true; // Set flag indicating coupon came from API
                    uiNeedsUpdate = true;
                }

                if (data.discountPercentage)
                {
                    // Remove any decimal places from the discount percentage
                    window.parityDealsInfo.discountPercentage = parseInt(data.discountPercentage).toString();
                    uiNeedsUpdate = true;
                }

                // Add handling for country from the API
                if (data.country)
                {
                    window.parityDealsInfo.country = data.country;
                    uiNeedsUpdate = true;
                }

                if (uiNeedsUpdate)
                {
                    updateUI();
                }
            } catch (error)
            {
                console.log("Error fetching coupon from Parity Deals API:", error);
            }
        };

        // Initialize the UI based on current state
        updateUI();

        // Fetch from API only once
        fetchParityCoupon();
    });

})(jQuery);
