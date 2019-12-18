(function() {
    const context = {
        ctaText: 'Sign Up',
        eventDate: 'Thursday, January 23, 2019',
        location: 'Los Angeles, CA USA',
        orgName: 'BizDay.LA',
    }
    
    const template = BizDayLA.templates.hero(context);
    document.body.innerHTML += template;
})()