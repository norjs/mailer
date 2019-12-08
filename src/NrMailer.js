/** @norjs/mailer -- Library sending HTML-based multipart/alternative emails
 *
 * @license MIT
 * @fileOverview
 */

import AssertUtils from '@norjs/utils/Assert';
import _ from 'lodash';
import NODEMAILER from "nodemailer";
import MARKED from 'marked';

/**
 * @typedef {Object} NodeMailerInfoObject
 * @property {string} messageId -
 * @property {Object} envelope -
 * @property {Array} accepted -
 * @property {Array} rejected -
 * @property {Array} pending -
 */

/**
 * @typedef {Object} NodeMailerResultObject
 * @property {NodeMailerInfoObject} info -
 * @property {string} response -
 */

/**
 *
 */
export class NrMailer {

	/**
	 *
	 * @returns {string}
	 */
	static get nrName () {
		return "NrMailer";
	}

	/**
	 *
	 */
	static getMarkedOptions () {

		return {
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

	}

	/** The sending of an email message
	 *
	 * @param smtp
	 */
	constructor ({smtp} = {}) {

		if (!smtp) {
			throw new TypeError(`new ${NrMailer.nrName}: smtp option is required: "${smtp}"`);
		}

		AssertUtils.isObject(smtp);

		/**
		 *
		 * @member {Object}
		 * @private
		 */
		this._transport = NODEMAILER.createTransport("SMTP", smtp);

		/**
		 *
		 * @type {{smartLists: boolean, tables: boolean, breaks: boolean, smartypants: boolean, langPrefix: string, pedantic: boolean, gfm: boolean, sanitize: boolean}}
		 * @private
		 */
		this._markedOptions = NrMailer.getMarkedOptions();

	}

	/** Close mailer */
	close () {

		this._transportClose();

	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 *
	 * @returns {Promise}
	 */
	async verifyMailer () {

		return this._transportVerify();

	}

	// noinspection JSUnusedGlobalSymbols
	/** Send the email
	 *
	 * @param body {string}
	 * @param from {string}
	 * @param to {string}
	 * @param subject {string}
	 * @returns {Promise<{response: string, info: {messageId: string, accepted: Array, envelope: Object, rejected: Array, pending: Array}}>}
	 */
	async sendMail (
		{
			body,
			from,
			to,
			subject = undefined
		}
	) {

		AssertUtils.isString(body);
		AssertUtils.isString(from);
		AssertUtils.isString(to);

		if (subject !== undefined) {
			AssertUtils.isString(subject);
		} else {
			subject = NrMailer._getSubjectFromMarkdown(body) || 'No subject';
		}

		const html = await this._marked(body, this._markedOptions);

		return await this._sendMail(from, to, subject, body, `${html}`);

	}

	/**
	 * Convert markdown as HTML
	 *
	 * @param markdownString {string}
	 * @param options {Object}
	 * @returns {Promise<string>}
	 * @private
	 */
	async _marked (
		markdownString,
		options = undefined
	) {

		return await new Promise((resolve, reject) => {
			MARKED(markdownString, options, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});

	}

	/** Send email
	 *
	 * @param from {string}
	 * @param to {string}
	 * @param subject {string}
	 * @param text {string}
	 * @param html {string}
	 * @returns {Promise<NodeMailerResultObject>}
	 * @private
	 */
	async _sendMail (
		from,
		to,
		subject,
		text,
		html
	) {

		return this._transportSendMail({
			from,
			to,
			subject,
			text,
			html
		});

	}

	/**
	 *
	 * @returns {Promise}
	 * @private
	 */
	async _transportVerify () {

		return new Promise((resolve, reject) => {
			try {
				this._transport.verify((error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				});
			} catch (err) {
				reject(err);
			}
		});

	}

	/** Send mail
	 *
	 * @param data
	 * @returns {Promise<NodeMailerResultObject>}
	 * @private
	 */
	async _transportSendMail (data) {
		return new Promise( (resolve, reject) => {
			try {
				this._transport.sendMail(data, (error, info, response) => {
					if (error) {
						reject(error);
					} else {
						resolve({info, response});
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	/** Close mail transport
	 *
	 * @private
	 */
	_transportClose () {

		this._transport.close();

	}

	/**
	 * Returns the subject, if found, from the markdown message.
	 *
	 * @param body {string}
	 * @private
	 */
	static _getSubjectFromMarkdown (body) {

		body = _.trim(body, ' \n\r\t');

		const index = body.indexOf('\n');
		if (index >= 0) {
			body = body.substr(0, index);
		}

		return _.trim(body, '# \n\r\t');

	}

}

// noinspection JSUnusedGlobalSymbols
export default NrMailer;
