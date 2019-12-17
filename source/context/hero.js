(function() {
    const heroContext = {
        ctaText: 'Sign Up',
        eventDate: 'Thursday, January 23, 2019',
        location: 'Los Angeles, CA USA',
        orgName: 'BizDay.LA',
    }
    
    const template = BizDayLA.templates.hero(heroContext);
    document.body.innerHTML += template;
})()