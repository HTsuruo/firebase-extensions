# Trigger GitHub issues from Crashlytics alerts

**Author**: Hideki TSURUOKA (**[https://github.com/HTsuruo](https://github.com/HTsuruo)**)

**Description**: Automatically creates GitHub Issues triggered by new Crashlytics fatal/non-fatal issues.

**Details**: By using this extension, creates a GitHub Issue on your selected repository, and attached required labels, triggered by new Crashlytics fatal issues.

The features of this extension are as follows:

- Automatically creates GitHub Issues if new Crashlytics fatal issues report
  - Using GitHub API's [Create an issue](https://docs.github.com/ja/rest/issues/issues?apiVersion=2022-11-28#create-an-issue)
- Allows developer to set required multiple labels
  - ex. bugs, crashlytics

**This extension helps to simplify the construction of the contents described in the [Firebase Alerts triggers](https://firebase.google.com/docs/functions/alert-events#handle-crashlytics-alerts) section of the official documentation. There's no need for creating service accounts or setting up Cloud Functions. Simply install the extension and it's all done with a single click.**

## Supported crashlytics alerts

- `crashlytics.newFatalIssue`: An event is sent when an application experiences a new fatal crash (not for any subsequent, identical events).
- `crashlytics.newNonfatalIssue`: An event is sent when an application experiences a new non-fatal error (not for any subsequent, identical events).

### Not supported (Future Works)

- `crashlytics.newAnrIssue`: An event is sent when an application experiences a new Application Not Responding (ANR) error (not for any subsequent, identical events).
- `crashlytics.regression`: An event is sent when an application experiences a crash for an issue marked as closed for a previous application version.
- `crashlytics.stabilityDigest`: An event is sent when there is a notification of the top trending issues in Crashlytics.
- `crashlytics.velocity`: An event is sent when a single issue is responsible for causing a significant number of application sessions to crash.

## Additional setup

Before installing this extension, make sure that you've [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) in your GitHub account to access GitHub API（if your repository is organization, use GitHub Apps）. Two approach exists, but `Fine-grained personal access tokens` is recommended.

### Permissions

Required 「repository permissions > Issues > Read and write」only
<img width="630" alt="SCR-20230527-ogal-2" src="https://github.com/HTsuruo/firebase-extensions/assets/12729025/719bcfd8-12c7-4336-adde-924738553592">

## Billing

This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

<!-- List all products the extension interacts with -->
- Cloud Functions
- Cloud Secret Manager
- Crashlytics

When you use Firebase Extensions, you're only charged for the underlying resources that you use. A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan, for example calling to a Google Cloud Platform API or making outbound network requests to non-Google services. All Firebase services offer a free tier of usage. [Learn more about Firebase billing.](https://firebase.google.com/pricing)

**Configuration Parameters:**

- GitHub access token for your repository: Use PAT(Personal Access Token) or GitHub Apps Token

- The owner or organization name for your repository

- The name of your repository for creating issues

- Labels to associate with the issue: The param requires camma(,) separated format Only users with push access can set labels for new issues. Labels are silently dropped otherwise.

- The selection of alert type you want to trigger

- Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

**Other Resources**:

- createFatalIssue (firebaseextensions.v1beta.v2function)

- createNonFatalIssue (firebaseextensions.v1beta.v2function)

**APIs Used**:

- eventarc.googleapis.com (Reason: Powers all events and triggers)

- run.googleapis.com (Reason: Powers 2nd-gen functions)

**Access Required**:

This extension will operate with the following project IAM roles:

- firebasecrashlytics.viewer (Reason: Allows the extension to read Crashlytics reports.)