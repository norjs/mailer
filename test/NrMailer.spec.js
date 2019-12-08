import NrMailer from '../src/NrMailer';
import AssertUtils from "@norjs/utils/Assert";
import sinon from 'sinon';

/* globals describe,it */

const NODEMAILER_MOCK = {
    createTransport () {}
};

const TRANSPORT_MOCK = {

    verify () {},

    sendMail () {},

    close () {}

};

const TEST_EMAIL_FROM = 'sender@example.com';

const TEST_EMAIL_TO = 'user@example.com';

const TEST_EMAIL_SUBJECT = 'Test Subject';

const TEST_MARKER_OPTIONS = {
    gfm: true,
    //highlight: highlight_syntax_code_syntaxhiglighter,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
};

const TEST_SMTP_CONFIG = {
    "host": "smtp.example.com",
    "port": 465,
    "secureConnection": true,
    "auth": {
        "user": "app",
        "pass": "12345678"
    }
};

const TEST_MESSAGE = 'The subject of the message\n'+
    '--------------------------\n'+
    '\n'+
    'This is a *sample* email made with Markdown.\n'+
    '\n'+
    '| Tables | Are | Cool |\n'+
    '| ------ | --- | ---- |\n'+
    '| col 3 is      | right-aligned | $1600 |\n'+
    '| col 2 is      | centered      |   $12 |\n'+
    '| zebra stripes | are neat      |    $1 |\n';

const TEST_SEND_MAIL_MESSAGE_ID = 'hafherqfdg15234213gsgfa!';
const TEST_SEND_MAIL_MESSAGE_ENVELOPE = {};
const TEST_SEND_MAIL_MESSAGE_ACCEPTED = [];
const TEST_SEND_MAIL_MESSAGE_REJECTED = [];
const TEST_SEND_MAIL_MESSAGE_PENDING = [];

const TEST_SEND_MAIL_INFO_RESULT = {
    messageId: TEST_SEND_MAIL_MESSAGE_ID,
    envelope: TEST_SEND_MAIL_MESSAGE_ENVELOPE,
    accepted: TEST_SEND_MAIL_MESSAGE_ACCEPTED,
    rejected: TEST_SEND_MAIL_MESSAGE_REJECTED,
    pending: TEST_SEND_MAIL_MESSAGE_PENDING
};

const TEST_SEND_MAIL_RESPONSE = 'abcd12345';

const TEST_SEND_MAIL_RESULT = {
    info: TEST_SEND_MAIL_INFO_RESULT,
    response: TEST_SEND_MAIL_RESPONSE
};

const TEST_HTML_RESPONSE = '<h3>The subject of the message</h3><p>Hello World</p>';

const TEST_SUBJECT_FROM_MARKDOWN = 'The subject of the message';

const TEST_VERIFY_RESULT = {};

describe('NrMailer', () => {

    const MARKED = sinon.fake.yields(null, TEST_HTML_RESPONSE);
    const getMarkedOptionsStub = sinon.stub(NrMailer, "getMarkedOptions");
    const createTransportStub = sinon.stub(NODEMAILER_MOCK, 'createTransport');
    const getSubjectFromMarkdownStub = sinon.stub(NrMailer, 'getSubjectFromMarkdown');
    const transportSendMailStub = sinon.stub(TRANSPORT_MOCK, "sendMail");
    const transportCloseStub = sinon.stub(TRANSPORT_MOCK, "close");
    const transportVerifyStub = sinon.stub(TRANSPORT_MOCK, "verify");

    afterEach( () => {
        sinon.reset();
    });

    describe('#constructor', () => {

        it('can create a mailer instance', async () => {

            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            sinon.assert.calledOnce(getMarkedOptionsStub);

            sinon.assert.calledOnce(createTransportStub);
            sinon.assert.calledWith(createTransportStub, "SMTP", TEST_SMTP_CONFIG);

            sinon.assert.notCalled(MARKED);

        });

    });

    describe('#closeMailer', () => {

        it('can close a mailer instance', async () => {

            createTransportStub.returns(TRANSPORT_MOCK);
            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            sinon.assert.calledOnce(getMarkedOptionsStub);

            sinon.assert.calledOnce(createTransportStub);
            sinon.assert.calledWith(createTransportStub, "SMTP", TEST_SMTP_CONFIG);

            sinon.assert.notCalled(MARKED);
            sinon.assert.notCalled(transportCloseStub);

            mailer.closeMailer();

            sinon.assert.calledOnce(transportCloseStub);

        });

    });

    describe('#destroy', () => {

        it('does not close an non-open mailer instance', async () => {

            createTransportStub.returns(TRANSPORT_MOCK);
            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            sinon.assert.calledOnce(getMarkedOptionsStub);

            sinon.assert.calledOnce(createTransportStub);
            sinon.assert.calledWith(createTransportStub, "SMTP", TEST_SMTP_CONFIG);

            sinon.assert.notCalled(MARKED);
            sinon.assert.notCalled(transportCloseStub);

            mailer.closeMailer();
            sinon.assert.calledOnce(transportCloseStub);
            transportCloseStub.resetHistory();

            mailer.destroy();
            sinon.assert.notCalled(transportCloseStub);

        });

        it('can close an open mailer instance', async () => {

            createTransportStub.returns(TRANSPORT_MOCK);
            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            sinon.assert.calledOnce(getMarkedOptionsStub);

            sinon.assert.calledOnce(createTransportStub);
            sinon.assert.calledWith(createTransportStub, "SMTP", TEST_SMTP_CONFIG);

            sinon.assert.notCalled(MARKED);
            sinon.assert.notCalled(transportCloseStub);

            mailer.destroy();

            sinon.assert.calledOnce(transportCloseStub);

        });

    });

    describe('#verifyMailer', () => {

        it('can verify a mailer instance', async () => {

            createTransportStub.returns(TRANSPORT_MOCK);
            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);
            transportVerifyStub.yields(null, TEST_VERIFY_RESULT);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            sinon.assert.calledOnce(getMarkedOptionsStub);

            sinon.assert.calledOnce(createTransportStub);
            sinon.assert.calledWith(createTransportStub, "SMTP", TEST_SMTP_CONFIG);

            sinon.assert.notCalled(MARKED);
            sinon.assert.notCalled(transportCloseStub);

            const result = await mailer.verifyMailer();

            sinon.assert.calledOnce(transportVerifyStub);

            AssertUtils.isEqual(result, TEST_VERIFY_RESULT);

        });

    });

    describe('#sendMail', () => {

        it('can send markdown email with subject', async () => {

            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);
            createTransportStub.returns(TRANSPORT_MOCK);
            transportSendMailStub.yields(null, TEST_SEND_MAIL_INFO_RESULT, TEST_SEND_MAIL_RESPONSE);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            const result = await mailer.sendMail({
                from: TEST_EMAIL_FROM,
                to: TEST_EMAIL_TO,
                subject: TEST_EMAIL_SUBJECT,
                body: TEST_MESSAGE
            });

            sinon.assert.notCalled(getSubjectFromMarkdownStub);

            sinon.assert.calledOnce(MARKED);
            sinon.assert.calledWith(MARKED, TEST_MESSAGE, TEST_MARKER_OPTIONS);

            sinon.assert.calledOnce(transportSendMailStub);
            sinon.assert.calledWith(transportSendMailStub, {
                from: TEST_EMAIL_FROM,
                to: TEST_EMAIL_TO,
                subject: TEST_EMAIL_SUBJECT,
                text: TEST_MESSAGE,
                html: TEST_HTML_RESPONSE
            });

            AssertUtils.isObject(result);

            AssertUtils.isObject(result.info);

            AssertUtils.isEqual(result.info.messageId, TEST_SEND_MAIL_MESSAGE_ID);
            AssertUtils.isEqual(result.info.envelope, TEST_SEND_MAIL_MESSAGE_ENVELOPE);
            AssertUtils.isEqual(result.info.accepted, TEST_SEND_MAIL_MESSAGE_ACCEPTED);
            AssertUtils.isEqual(result.info.rejected, TEST_SEND_MAIL_MESSAGE_REJECTED);
            AssertUtils.isEqual(result.info.pending, TEST_SEND_MAIL_MESSAGE_PENDING);

            AssertUtils.isEqual(result.response, TEST_SEND_MAIL_RESPONSE);

        });

        it('can send markdown email without a subject', async () => {

            getSubjectFromMarkdownStub.returns(TEST_SUBJECT_FROM_MARKDOWN);
            getMarkedOptionsStub.returns(TEST_MARKER_OPTIONS);
            createTransportStub.returns(TRANSPORT_MOCK);
            transportSendMailStub.yields(null, TEST_SEND_MAIL_INFO_RESULT, TEST_SEND_MAIL_RESPONSE);

            const mailer = new NrMailer(TEST_SMTP_CONFIG, NODEMAILER_MOCK, MARKED);

            AssertUtils.isInstanceOf(mailer, NrMailer);

            const result = await mailer.sendMail({
                from: TEST_EMAIL_FROM,
                to: TEST_EMAIL_TO,
                body: TEST_MESSAGE
            });

            sinon.assert.calledOnce(getSubjectFromMarkdownStub);
            sinon.assert.calledWith(getSubjectFromMarkdownStub, TEST_MESSAGE);

            sinon.assert.calledOnce(MARKED);
            sinon.assert.calledWith(MARKED, TEST_MESSAGE, TEST_MARKER_OPTIONS);

            sinon.assert.calledOnce(transportSendMailStub);
            sinon.assert.calledWith(transportSendMailStub, {
                from: TEST_EMAIL_FROM,
                to: TEST_EMAIL_TO,
                subject: TEST_SUBJECT_FROM_MARKDOWN,
                text: TEST_MESSAGE,
                html: TEST_HTML_RESPONSE
            });

            AssertUtils.isObject(result);

            AssertUtils.isObject(result.info);

            AssertUtils.isEqual(result.info.messageId, TEST_SEND_MAIL_MESSAGE_ID);
            AssertUtils.isEqual(result.info.envelope, TEST_SEND_MAIL_MESSAGE_ENVELOPE);
            AssertUtils.isEqual(result.info.accepted, TEST_SEND_MAIL_MESSAGE_ACCEPTED);
            AssertUtils.isEqual(result.info.rejected, TEST_SEND_MAIL_MESSAGE_REJECTED);
            AssertUtils.isEqual(result.info.pending, TEST_SEND_MAIL_MESSAGE_PENDING);

            AssertUtils.isEqual(result.response, TEST_SEND_MAIL_RESPONSE);

        });

    });

    describe('#getSubjectFromMarkdown', () => {

        it('can parse subject from multiline message', () => {
            getSubjectFromMarkdownStub.callThrough();
            AssertUtils.isEqual( NrMailer.getSubjectFromMarkdown('### Test Subject\n\nParagraph\n'), 'Test Subject' );
        });

        it('can parse first line as subject from multiline message', () => {
            getSubjectFromMarkdownStub.callThrough();
            AssertUtils.isEqual( NrMailer.getSubjectFromMarkdown('Test Subject\n\nParagraph\n'), 'Test Subject' );
        });

        it('can parse single line as a subject', () => {
            getSubjectFromMarkdownStub.callThrough();
            AssertUtils.isEqual( NrMailer.getSubjectFromMarkdown('Test Subject'), 'Test Subject' );
        });

    });

});
