# Using Node and Heroku to demo ApplePay on the Web

Site adapted from [EmporiumWeb](https://developer.apple.com/library/content/samplecode/EmporiumWeb/Introduction/Intro.html)

## Requirements:

* iOS 10 device that supports ApplePay (has TouchID or is an Apple Watch)
* (Optionally) macOS Sierra computer that supports Handoff (mid 2012 or newer, requires Bluetooth LE support)
    * Development can be largely done even with an OS version below Sierra and without
    Handoff support, though testing on it won't work.
* Apple developer account ($99/yr)
* Heroku account (free)
* Git, Node and NPM installed

## How to host the ApplePay Web example for free using Heroku:

### Sign up for [Heroku](https://www.heroku.com) (no CC needed)

Sign up then install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

Next from a terminal run `heroku login` and login.

Next clone this project to your computer and in your terminal change directories to that folder.

In the `lib/config.js` file change the `vantivIPAuth` value from `<Base64 Encoded Auth>` to the value provided by Vantiv IP.

In the `public/js/eprotectsupport.js` file change line 74 to contain the PaypageId provided by Vantiv IP.

Run `heroku create` to create a new Heroku app with a random name (that you can change later).

Next let's do some Apple setup.

### Get your Merchant Identity Certificate

Request your Merchant Identity Certificate by logging into your [Apple Developer Site](https://developer.apple.com) and going to
your Merchant ID and clicking "Create Certificate" under "Merchant Identity Certificate" and following the instructions. After you have
the certificate, follow these instructions to convert it to .PEM format and place it in the `certificates` folder.

#### Convert your Merchant Identity Certificate (.CER) to .PEM format

See this [link](http://stackoverflow.com/questions/21250510/generate-pem-file-used-to-setup-apple-push-notification) on SO

Ignore all the stuff about push certificates, this works for converting our Merchant Identity Certificate as well.

##### Basic steps:

1. Import the .cer into Keychain, export both the certificate and private key as one .p12 format 
file then run:

`openssl pkcs12 -in <p12filename>.p12 -out <pemfilename>.pem -nodes -clcerts`

2. Then put the pem file in `/certificates` named `applePayCert.pem`

### Testing Locally

First install all prerequisites by running `npm install`.

Then run `npm run dev` and browse to `http://localhost:4567/`. You should be able to open the page, but ApplePay won't work locally.

The `app.js` will run using HTTP instead of HTTPS because Heroku will automatically serve the page over HTTPS.
This also has the nice side benefit that we don't need the sslKey or sslCert like we would with original EmporiumWeb example 
(but we still need the applePayCert).

If running locally using `npm run dev` then the server will spin up on port 4567 otherwise `process.env.PORT` will be used
(which Heroku will have set to 80).

### Deploying to Heroku

Now deploy this project to Heroku by running `git push heroku master`. 

You should now be able to hit `https://<name>.herokuapp.com` though ApplePay won't work yet.

If any changes are made to any files in the `lib` folder be sure to run `npm run build` before deploying to Heroku, in order to generate
the files in the `dist` folder (which Heroku will run).

### Validate your domain

Next, follow the instructions [here](https://developer.apple.com/reference/applepayjs/) to validate your merchant domain.
Apple will provide a file with which to perform the validation.

Place the file in the `.well-known` folder, commit the file with 

`git add . && git commit -m 'added apple verification file'`

then deploy to Heroku again with `git push heroku master`. Then return to your Apple Developer page and complete verification.

Finally, with all that done you can hit `https://<name>.herokuapp.com` and perform an ApplePay transaction in two ways:

* From Safari on an iOS 10 device with ApplePay support
* From Safari on a Mac running macOS Sierra that [supports Handoff](https://support.apple.com/kb/PH25169?locale=en_US) (2012 and later hardware)

After completing a transaction you should see, first, a registration id appear, followed by the results of the transaction to Vantiv IP.

## Apple Resources

* [Apple Pay Developer Site](https://developer.apple.com/apple-pay/)
* [Apple Pay on the web WWDC Session Video](https://developer.apple.com/videos/play/wwdc2016/703/)
* [Apple Pay Domain Verification](https://developer.apple.com/support/apple-pay-domain-verification/)