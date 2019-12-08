@norjs/mailer
=============

Asynchronous HTML email sending with Markdown formating.

We are using:

 * [nodemailer](https://github.com/andris9/Nodemailer#nodemailer) for actual email sending
 * [marked](https://github.com/chjj/marked) for Markdown to HTML conversion
 * [lodash](https://lodash.com)

### Example Usage

Sends HTML formated email with markdown text alternative.

```javascript
import NrMailer from "@norjs/mailer";

async function example () {

    const smtp_config = {
        "host": "smtp.example.com",
        "port": 465,
        "secureConnection": true,
        "auth": {
            "user": "app",
            "pass": "12345678"
        }
    };

    const mailer = NrMailer.createMailer(smtp_config);

    const body = 'The subject of the message\n'+
        '--------------------------\n'+
        '\n'+
        'This is a *sample* email made with Markdown.\n'+
        '\n'+
        '| Tables | Are | Cool |\n'+
        '| ------ | --- | ---- |\n'+
        '| col 3 is      | right-aligned | $1600 |\n'+
        '| col 2 is      | centered      |   $12 |\n'+
        '| zebra stripes | are neat      |    $1 |\n';

    await mailer.sendMail({
        from:'app@example.com', 
        to:'jhh@example.com',
        subject:'Example message',  // This is optional, if not specified, will be "The subject of the message" from the markdown content.
        body: body
    });

    await mailer.closeMailer();

    console.log('Email sent successfully.');

}
```

Commercial Support
------------------

You can buy commercial support from [Sendanor](https://norjs.com/).
