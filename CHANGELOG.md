# Change history for ui-requests-mediated

## [2.0.0] (https://github.com/folio-org/ui-requests-mediated/tree/v2.0.0) (2024-11-30)
[Full Changelog](https://github.com/folio-org/ui-requests-mediated/compare/v1.1.0...v2.0.0)
* Print slip for Mediated requests activity - Send item in transit. Refs UIREQMED-40.
* Persist filters when changing between actions. Refs UIREQMED-44.
* Implement functionality for editing mediated request. Refs UIREQMED-22.
* *BREAKING* Migrate to new `mod-circulation-bff` endpoints. Refs UIREQMED-39.
* Add circulation-storage.staff-slips.collection.get for get staff-slips on Send item in transit. Refs UIREQMED-55.
* Add Decline Action for Mediated request with status of New - Awaiting confirmation. Refs UIREQMED-42.
* Fix DOMPurify import. Refs UIREQMED-56.
* Hide proxy functionality. Refs UIREQMED-59.
* Add functionality for managing missing data related to item, instance, requester. Refs UIREQMED-51.
* Update permission after mod-requests-mediated permission changes. Refs UIREQMED-62.

## [1.1.0](https://github.com/folio-org/ui-requests-mediated/tree/v1.1.0) (2024-10-30)
* Update github actions. Refs UIREQMED-14.
* Add landing page actions: Confirm item arrival, Mediated requests activities and Send item in transit. Refs UIREQMED-2.
* Hide permission that should not be visible. Refs UIREQMED-20.
* Add caret to `react` peer dependency. Refs UIREQMED-23.
* Add Search field for Mediated requests activity page. Refs UIREQMED-3.
* Add Filters for Mediated requests actions page. Refs UIREQMED-4.
* Update permission for Mediated requests. Refs UIREQMED-29.
* Implement `Create mediated request` form with basic functionality. Refs UIREQMED-27.
* Add Mediated request status and Mediated request level filters for Mediated requests actions page. Refs UIREQMED-25.
* Add Search for Mediated requests actions page. Refs UIREQMED-26.
* Add Actions button and dropdown in Mediated requests UI. Refs UIREQMED-6.
* Add Actions for Mediated requests details. Refs UIREQMED-11.
* Add changes for integration between different stories. Refs UIREQMED-32.
* Add `Closed - Cancelled` status to `Mediated request status` filter. Refs UIREQMED-33.
* Implement Request information accordion and save functionality on request form. Refs UIREQMED-30.
* Implement functionality of `New mediated request` button. Refs UIREQMED-35.
* Migrate to mediated requests endpoints, refactor constants, utils. Refs UIREQMED-28.
* Implement Mediated requests details page. Refs UIREQMED-10.
* Implement proxy functionality on mediated request form and on mediated details page. Refs UIREQMED-31.
* Add instance title to page title if the detail record is opened. Refs UIREQMED-16.
* Create table of filtered Mediated requests in Mediated requests app. Refs UIREQMED-5.
* Remove mediated requests from settings. Refs UIREQMED-41.
* Update Filters for Mediated requests page. Refs UIREQMED-37.
* Add Export Action to Mediated requests. Refs UIREQMED-34.
* Mediated requests activities - Add Content for Confirm item arrival. Refs UIREQMED-8.
* Update upload-artifact actions from v1 and v2 to v4. Refs UIREQMED-43.
* Update HTML page title with search term entered. Refs UIREQMED-17.
* Mediated requests activities - Add Content for Send item in transit. Refs UIREQMED-9.
* Update Mediated requests permissions in Closed stories. Refs UIREQMED-36.
* Implement functionality for creating new mediated request. Refs UIREQMED-7.
* Review and cleanup Module Descriptor. Refs UIREQMED-47.

## 1.0.0
* New app created with stripes-cli. Updated module after created with stripes-cli. Refs UIREQMED-1.
