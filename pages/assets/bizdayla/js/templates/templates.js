this["BizDayLA"] = this["BizDayLA"] || {};
this["BizDayLA"]["templates"] = this["BizDayLA"]["templates"] || {};
this["BizDayLA"]["templates"]["App"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
this["BizDayLA"]["templates"]["header"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"navbar-container\">\r\n  <nav class=\"navbar navbar-expand-lg navbar-dark\" data-overlay data-sticky=\"top\">\r\n    <div class=\"container\">\r\n      <a class=\"navbar-brand fade-page\" href=\"index.html\">\r\n        <img src=\""
    + alias4(((helper = (helper = helpers.logoPath || (depth0 != null ? depth0.logoPath : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoPath","hash":{},"data":data,"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":30}}}) : helper)))
    + "\" alt=\"Leap\">\r\n        <p class=\"header_text\">"
    + alias4(((helper = (helper = helpers.orgName || (depth0 != null ? depth0.orgName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"orgName","hash":{},"data":data,"loc":{"start":{"line":6,"column":31},"end":{"line":6,"column":42}}}) : helper)))
    + "</p>\r\n      </a>\r\n      <a href=\"#\" class=\"btn btn-primary ml-lg-3\">"
    + alias4(((helper = (helper = helpers.ctaText || (depth0 != null ? depth0.ctaText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaText","hash":{},"data":data,"loc":{"start":{"line":8,"column":50},"end":{"line":8,"column":61}}}) : helper)))
    + "</a>\r\n    </div>\r\n  </nav>\r\n</div>";
},"useData":true});