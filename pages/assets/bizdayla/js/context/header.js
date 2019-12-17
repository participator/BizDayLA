const headerContext = {
    ctaText: 'Sign Up',
    logoPath: '/assets/img/app-icon.svg',
    orgName: 'BizDay.LA'
}

const headerElem = document.getElementById('header');
const template = BizDayLA.templates.header(headerContext);
headerElem.innerHTML = template;