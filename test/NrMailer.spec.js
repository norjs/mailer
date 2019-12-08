import NrMailer from '../src/NrMailer';
import AssertUtils from "@norjs/utils/Assert";

describe('NrMailer', () => {

    describe('#getSubjectFromMarkdown', () => {

        it('can parse subject from multiline message', () => {
            AssertUtils.isEqual( NrMailer.getSubjectFromMarkdown('### Test Subject\n\nParagraph\n'), 'Test Subject' );
        });

        it('can parse first line as subject from multiline message', () => {
            AssertUtils.isEqual( NrMailer.getSubjectFromMarkdown('Test Subject\n\nParagraph\n'), 'Test Subject' );
        });

        it('can parse single line as a subject', () => {
            AssertUtils.isEqual( NrMailer.getSubjectFromMarkdown('Test Subject'), 'Test Subject' );
        });

    });

});
