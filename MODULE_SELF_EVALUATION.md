## Module 'ui-requests-mediated' Self-Evaluation Checklist

Based on [FOLIO Module Acceptance Values and Criteria version 3.0](https://github.com/folio-org/tech-council/blob/master/MODULE_ACCEPTANCE_CRITERIA.MD)

## Administrative
* [ ] Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.

## Shared/Common
* [ ] Uses Apache 2.0 license (2)
* [ ] Module build MUST produce a valid module descriptor (3, 5)
  * _This is not applicable to libraries_
* [ ] Inclusion of third party dependencies complies with [ASF 3rd Party License Policy](https://apache.org/legal/resolved.html) (2)
  * Uses README for [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
  * org.z3950.zing:cql-java is allowed if appropriately labelled, even if it is LGPL-2.1-only
  * org.marc4j:marc4j is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
  * org.hibernate.* is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
  * _note: If a library declares multiple licenses in its pom.xml, [only one of them needs to comply](https://maven.apache.org/ref/3.9.11/maven-model/maven.html#project)._
* [ ] Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * _This is not applicable to libraries_
* [ ] [Personal data form](https://github.com/folio-org/personal-data-disclosure) is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
  * _This is not applicable to libraries_
* [ ] Sensitive and environment-specific information is not checked into git repository (6)
* [ ] Written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (3, 5)
* [ ] Uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
  * _This is not applicable to libraries_
* [ ] Must not depend on a FOLIO library that has not been approved through the TCR process
* [ ] Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
* [ ] Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details.
* [ ] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
* [ ] Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  * _The FOLIO Community LSP Platform is defined at https://github.com/folio-org/platform-lsp._
  * _This can be evaluated by searching application descriptors across the folio-org GitHub organization (considering those applications part of the community platform) and confirming that this module only appears in the application descriptor of the one specified application._

## Frontend

* [ ] For each consumed API `package.json` MUST include the interface requirement in the `"okapiInterfaces"` or `"optionalOkapiInterfaces"` section (3, 5)
  * -_note: read more at https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#the-package-file-stripes-entry_
* [ ] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [ ] Have i18n support via react-intl and an en.json file with English texts (8)
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* [ ] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (10, 16)
* [ ] Follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * E.g. Saving state when navigating between apps (or confirming that you'll lose the state)
  * For UI links to documentation, there is no rule on where that documentation should be hosted, i.e. docs.folio.org, or wiki.folio.org, or module-specific destinations, as long as it is publicly accessible.
* [ ] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation (10)
