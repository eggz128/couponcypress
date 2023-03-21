describe('A suite', function () {
    beforeEach(function () {
        cy.visit('https://www.edgewordstraining.co.uk/demo-site/');
        cy.contains('Dismiss').click();
    });
    afterEach(function () {
        cy.get('.remove').click();
        cy.contains('.button', 'Return to shop').click();
        cy.contains('Home').click();
    });
    for (let testiteration = 0; testiteration < 1; testiteration++) {
        //Orders 2 caps, uses drop down to navigate to cart,  applies edgewords coupon, asserts on coupon discount amount
        it('Checks the coupon', function () { //CANNOT use async/await with Cypress. cy commands are async (effects happen later) but are enqued for sequential execution.
            //You cannot capture elements/text like so
            let body = cy.get('body')
            let bodyText = body.invoke('text')
            console.log(bodyText)
            //But instead commands are chained with results yeilded down line and then()able
            cy.get('body').invoke('text').then(text => {
                console.log(text); // Appears in browsers dev console
                cy.log(text);// Appears in Cypress log
            });


            {   //Native keypress events check - spoiler Cypress doesn't. Check the dev console for key down/up events
                cy.get('input[placeholder="Search products…"]').first().type('{shift}cap{shift}').wait(1000).clear();
                //notice the chaining in above - we can wait after typing, then ater that clear.
            }
            /*
            * Arrange
            */
            cy.contains('label', 'Search for:').siblings('[type=search]').type('cap{enter}');

            cy.contains('button', 'Add to cart').click();

            //Handle drop down
            //cy.get('#site-header-cart').hover() //Error with link to https://docs.cypress.io/api/commands/hover
            //cy.get('#site-header-cart').trigger('mouseover') //No effect - drop down is not JS driven - it is css :hover driven. Potentially lots of discovery time to find this out.
            cy.get('.widget_shopping_cart').invoke('css', 'left', '0'); //ALTER THE PAGE CSS to move the drop down onscreen (from -999em to 0)
            cy.get('#site-header-cart').contains('View cart').click(); //Chained to ensure failiure if drop down is off screen
            //Alternative drop down fix - force the "click" - users cant click -19000ish pixels left off screen. But Cypress isn't doing "click"s
            //cy.get('#site-header-cart').contains('View cart').click({force:true})

            /*
            * Act
            */
            cy.get('[id^=quantity]').clear().type('2'); //More chaining - sets cap qty to 2
            cy.get('[name="update_cart"]').click();

            cy.get('#coupon_code').type('edgewords');
            cy.contains('Apply coupon').click();

            //Capture values - this will be quite different from wdjs/playwright where we leverage async/await
            // =========Welcome to the pyramid of doom=========
            //Note explicit assertions in then() wont retry on failiure. You can substitute then() for should() if you want retries.
            cy.contains('h2', 'Cart totals').siblings('table').within(() => { //Limit search inside table
                cy.contains('th', 'Subtotal').siblings('td').invoke('text').then((subTotal => { //Capture innerText using jQuery invoke() method. This is yeilded down to then() wherein
                    cy.log(subTotal); //We have a closure over subtotalText
                    //Do next capture in here
                    cy.contains('th', /^Coupon/).siblings('td').find('.amount').invoke('text').then((couponDiscount) => {
                        cy.log(`Closure over subtotalText ${subTotal} and discountText ${couponDiscount} achieved`);
                        cy.contains('th', 'Shipping').siblings('td').find('.amount').invoke('text').then(shipping => {
                            cy.log(`Now also with closure over shipping ${shipping}`);
                            cy.contains('th', 'Total').siblings('td').find('.amount').invoke('text').then(total => {
                                cy.log(`Checking values have been captured: ${subTotal} ${couponDiscount} ${shipping} ${total}`);

                                /*
                                * Assert
                                */
                                //Strip £, convert to whole pennies for calc purposes. There are better suited external libraries for monetary/currency calculations, but this avoids extra dependencies
                                let textTotals = [subTotal, couponDiscount, shipping, total].map(function (x) { return x.replace('£', '') });
                                let [subTotalPennies, couponDiscountPennies, shippingPennies, totalPennies] = textTotals.map(text => parseFloat(text) * 100);

                                console.log(`Checking conversion to pennies worked: ${subTotalPennies} ${couponDiscountPennies} ${shippingPennies} ${totalPennies}`);

                                //Test calculates 15% discount for comparison with site calculation
                                let calculatedDiscount = Math.round(subTotalPennies * 0.15); //rounding to avoid possible fractions of a penny
                                //calculatedDiscount -= 1; //Saboutage test to check assertion
                                cy.log(`Captured values:
                                CapturedPennies,CapturedDiscountPennies,CapturedShippingPennies,CapturedTotalPennies : Sub-Discount+Shipping=Total
                                ${[subTotalPennies, couponDiscountPennies, shippingPennies, totalPennies]} : ${subTotalPennies - couponDiscountPennies + shippingPennies == totalPennies}
                                CapturedPennies,CalculatedDiscountPennies,CapturedShippingPennies,CapturedTotalPennies : Sub-Discount+Shipping=Total
                                ${[subTotalPennies, calculatedDiscount, shippingPennies, totalPennies]} : ${subTotalPennies - calculatedDiscount + shippingPennies == totalPennies}
                                `);
                                //Chai explicit (because values were captured rather than yeilded down chain) - same as in wdjs project
                                expect(couponDiscountPennies).to.equal(calculatedDiscount);
                            });
                        });
                    });
                }));
            });
            console.log('Finished - but actually appears in browser dev console beacuse effect happens now, cy. stuff happens later');
            console.log('cy.log("message") is therefore preferred for logging')
        });
    };
});