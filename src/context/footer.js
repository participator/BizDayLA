(function() {
    const context = {
        tagline: 'Connect with local business owners',
        ctaText: 'Sign Up',
        email: 'organizers@bizday.la',
    };

    const template = BizDayLA.templates.footer(context);
    document.body.innerHTML += template;    
})()