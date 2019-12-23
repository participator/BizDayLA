(function() {
    const context = {
        ctaText: 'Sign Up',
        logoPath: '/assets/img/app-icon.svg',
        orgName: 'BizDay',
        confName: 'BizDay.LA'
    }
    
    const template = Handlebars.partials.header(context);
    // const template = BizDayLA.templates.header(context);
    document.body.innerHTML += template;
})()