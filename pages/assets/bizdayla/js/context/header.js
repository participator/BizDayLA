const headerContext = {
    ctaText: 'Sign Up',
    logoPath: '/assets/img/app-icon.svg',
    orgName: 'BizDay.LA'
}

const template = BizDayLA.templates.header(headerContext);
document.body.innerHTML += template;