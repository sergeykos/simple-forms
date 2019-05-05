import * as React from 'react';
import './style';

interface IState {
    isPhoneValueValid: boolean,
    phoneValue: string
}

class Feedback extends React.Component<{}, IState> {

    state = {
        isPhoneValueValid: false,
        phoneValue: '+7'
    }

    handleInputChange = (value: string) => {
        if (value === '') {
            this.setState(() => ({
                isPhoneValueValid: false,
                phoneValue: '+7'
            }));
        }

        if (this.isPhoneValueValid(value)) {
            
            this.setState(() => ({
                isPhoneValueValid: true,
                phoneValue: value
            }));
        }
    }

    escapeSpecialChars = (value: string) => value.replace(/[+-]/g, '');

    formatPhoneValue(_value: string) {
        const value = this.escapeSpecialChars(_value);
        const valueLength = value.length;
        let formattedValue = '';

        for (let i = 0; i < valueLength; i++) {
            formattedValue += value[i];
            if (i === 0 && valueLength > 1) {
                formattedValue += '-';
            }
            if (i === 3 && valueLength > 4) {
                formattedValue += '-';
            }
            if (i === 6 && valueLength > 7) {
                formattedValue += '-';
            }
            if (i === 8 && valueLength > 9) {
                formattedValue += '-';
            }
        }

        return '+' + formattedValue;
    }

    isPhoneValueValid (value: string): boolean {
        const nextValue = this.escapeSpecialChars(value);

        if (isNaN(+nextValue) || nextValue.length > 11) {
            return false;
        }

        if (nextValue.match(/^7[0-9]{0,10}/) === null) {
            return false;
        }
    
        return true;
    }

    isPhoneValueCompleted(): boolean {
        const phoneValue = this.escapeSpecialChars(this.state.phoneValue);

        return this.isPhoneValueValid(phoneValue) && phoneValue.length === 11;
    }

    render() {
        const className = 'feedback';
        const { phoneValue, isPhoneValueValid } = this.state;
        const isButtonSendDisabled = !isPhoneValueValid || !this.isPhoneValueCompleted();

        return (
            <div className={ className }>
                <div className={ `${className}__title` }>
                    Оставьте заявку и узнайте, по какой процентной ставке с Вами готовы работать банки
                </div>
                <div className={ `${className}__form` }>
                    <input 
                        className={ `${className}__form__input-phone` } 
                        placeholder="+7-999-999-99-99"
                        value={ this.formatPhoneValue(phoneValue) } 
                        onChange={ (event) => this.handleInputChange(event.target.value) }/>
                    <button className={ `${className}__form__button-send ${isButtonSendDisabled ? 'disabled' : ''}` }>
                        Получить кредит
                    </button>
                </div>
            </div>
        );
    }
}

export default Feedback;