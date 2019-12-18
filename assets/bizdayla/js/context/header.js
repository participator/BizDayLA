(function() {
    const context = {
        ctaText: 'Sign Up',
        logoPath: '/assets/img/app-icon.svg',
        orgName: 'BizDay.LA'
    }
    
    const template = BizDayLA.templates.header(context);
    document.body.innerHTML += template;
})()