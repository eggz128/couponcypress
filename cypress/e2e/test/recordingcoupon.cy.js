describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it.only('Coupon check', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://www.edgewordstraining.co.uk/demo-site/');
    cy.get('.woocommerce-store-notice__dismiss-link').click();
    cy.get('#woocommerce-product-search-field-0').clear('c'); //Unknown why recorder has passed clear an arg 'c'. Doesnt seem to break things so leaving it.
    cy.get('#woocommerce-product-search-field-0').type('cap{enter}');
    //cy.get(':nth-child(1) > .site-search > .widget > .woocommerce-product-search > button').click(); //Studio has incorrectly added this
    
    cy.get('.single_add_to_cart_button').click();
    cy.get('.woocommerce-mini-cart__buttons > [href="https://www.edgewordstraining.co.uk/demo-site/cart/"]').click({force: true}); //Edited to force click. Link is off screen.
    cy.get('[id^=quantity]').clear('2'); //Recorder used locator #quantity_640901af54c41 but it is dynamic. Edited to fix.
    cy.get('[id^=quantity]').type('2');
    cy.get('[name="update_cart"]').click();
    cy.get('#coupon_code').clear('e');
    cy.get('#coupon_code').type('edgewords');
    cy.get('.coupon > .button').click();
    cy.get('.cart-subtotal > td > .woocommerce-Price-amount > bdi').should('have.text', '£32.00');
    cy.get('.cart-discount > td > .woocommerce-Price-amount').should('have.text', '£4.80');
    cy.get('label > .woocommerce-Price-amount > bdi').should('have.text', '£3.95');
    cy.get('strong > .woocommerce-Price-amount > bdi').should('have.text', '£31.15');
    cy.get('.remove').click();
    //cy.get('.button').click(); //Matches more than one thing
    cy.contains('.button','Return to shop').click(); //Could have stuck with .get() and changed to another locator
    cy.get('#menu-item-42 > a').click();
    /* ==== End Cypress Studio ==== */
  });
})