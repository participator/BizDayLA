function showTitleWhenCompanyNameEmpty(companyName, speakerTitle) {
    console.log('[Helper Arguments]:', arguments);
    return companyName || speakerTitle;
}