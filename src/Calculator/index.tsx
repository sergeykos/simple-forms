import * as React from 'react';
import './style';

declare const MODE: 'development' | 'production';

enum EnumCreditDurationType {
    MONTH = 'month',
    YEAR = 'year'
}

enum EnumInputName {
    CREDIT_SUM = 'creditSum',
    CREDIT_DURATION = 'creditDuration',
    CREDIT_RATE = 'creditRate'
}

const initialState: IState = {
    creditSum: '',
    creditDuration: '',
    creditRate: '',
    creditDurationType: EnumCreditDurationType.MONTH,
    monthlyPayment: '',
    overPayment: ''
}

interface IState {
    creditSum: string,
    creditDuration: string,
    creditRate: string,
    creditDurationType: EnumCreditDurationType,
    monthlyPayment: string,
    overPayment: string
}

class Calculator extends React.Component<{}, IState> {
    state = initialState;
    className = 'calculator';

    handleInputChange = (value: string, inputName: EnumInputName) => {
        const nextValue = value.replace(/ /g, '').replace(/,/g , '.');

        this.setState((state: IState) => {
            if (inputName === 'creditSum' && !this.isValidSum(nextValue)) {
                return null;
            }

            if (inputName === 'creditDuration' && !this.isValidTerm(nextValue)) {
                return null;
            }
            
            if (inputName === 'creditRate' && !this.isValidRate(nextValue)) {
                return null;
            }

            if (nextValue === state[inputName]) {
                return null;
            }

            return {
                ...state,
                [inputName]: nextValue
            }
        
        });
    }

    handleCreditDurationTypeChange = (value: EnumCreditDurationType) => {
        this.setState((state: IState) => {
            if (value === state.creditDurationType) {
                return null;
            }

            return {
                creditDuration: '',
                creditDurationType: value
            }
        })
    }

    isValidSum = (value: string): boolean => {
        return value.match(/^[0-9]*$/) !== null && !isNaN(+value) && value.length <= 9;
    }

    isValidTerm = (value: string): boolean => {
        const creditDurationType = this.state.creditDurationType;

        if (value.match(/^[0-9]*$/) === null || isNaN(+value)) {
            return false;
        }

        if (creditDurationType === EnumCreditDurationType.MONTH && value.length > 3) {
            return false;
        }

        if (creditDurationType === EnumCreditDurationType.YEAR && value.length > 2) {
            return false
        }

        return true;
    }

    isValidRate = (value: string): boolean => {
    
        if (value.match(/^[0-9]{0,2}$|^[0-9]{1,2}\.[0-9]{0,2}$/) === null) {
            return false;
        }

        return +value < 100 && value.length <= 5;
    }

    handeButtonCalculateClick = () => {
        const creditSum = +this.state.creditSum;
        const creditDurationType = this.state.creditDurationType;
        const creditRate = +this.state.creditRate;
        let creditDuration = +this.state.creditDuration;

        if (creditDurationType === EnumCreditDurationType.YEAR) {
            creditDuration *= 12;
        }

        const monthlyCreditRate = creditRate / (12 * 100);
        const monthlyPayment = Math.floor(creditSum * monthlyCreditRate / (1 - (Math.pow(1 + monthlyCreditRate, -creditDuration))));
        const overPayment = Math.floor(creditDuration * monthlyPayment) - creditSum;

        this.setState({
            monthlyPayment: monthlyPayment.toString(),
            overPayment: overPayment.toString()
        })
    }

    formatToSpacedNumber(value: string) {
        const numberLength = value.length; 

        if (numberLength < 4) return value;

        let result = '';

        for (let i = numberLength - 1; i > 0; i--) {
            result = value[i] + result;
            if ((numberLength - i) % 3 === 0) {
                result = ' ' + result;
            }
        }
        result = value[0] + result;

        return result;
    }

    getInputValue(inputName: EnumInputName) {
        const value = this.state[inputName];

        if (value === null) {
            return '';
        }

        return value.toString();
    }

    get creditSum(): string {
        return this.formatToSpacedNumber(this.state.creditSum);
    }

    get creditDuration(): string {
        return this.formatToSpacedNumber(this.state.creditDuration);
    }

    get creditRate(): string {
        return this.state.creditRate;
    }

    get monthlyPayment(): string {
        return this.formatToSpacedNumber(this.state.monthlyPayment);
    }

    get overPayment(): string {
        return this.formatToSpacedNumber(this.state.overPayment);
    }

    renderSeparator() {
        const { monthlyPayment, overPayment } = this.state;
        let className = `${this.className}__horizontal-line`;

        if (monthlyPayment === '' || overPayment === '') {
            className += ' hidden';
        }

        return <div className={ className } />;
    }

    renderCalculationResult() {
        const { monthlyPayment, overPayment } = this.state;
        let className = `${this.className}__result`;

        if (monthlyPayment === '' || overPayment === '') {
            className += ' hidden';
        }

        return (
            <div className={ className }>
                <div className={ `${className}__row` }>
                    <div className={ `${className}__row__label` }>Сумма ежемесячного платежа:</div>
                    <div className={ `${className}__row__value` }><b>{ this.monthlyPayment }</b> <i>рублей</i></div>
                </div>
                <div className={ `${className}__row` }>
                    <div className={ `${className}__row__label` }>Переплата по процентам за кредит:</div>
                    <div className={ `${className}__row__value` }><b>{ this.overPayment }</b> <i>рублей</i></div>
                </div>
            </div>
        )
    }

    render() {
        const { creditSum, creditDuration, creditRate, creditDurationType } = this.state;
        const className = this.className;
        const isButtonCalculateDisabled = [creditSum, creditDuration, creditRate].some((value: string) => +value === 0);

        return (
            <div className={ className + (MODE === 'development' ? ' dev' : '') }>
                <div className={ `${className}__title` }>Параметры кредита</div>
                <div className={ `${className}__row` }>
                    <div className={ `${className}__row__label left` }>Сумма кредита:</div>
                    <input 
                        className={ `${className}__row__input` }
                        type='text'
                        value={ this.creditSum }
                        onChange={ (event) => this.handleInputChange(event.target.value, EnumInputName.CREDIT_SUM) } />
                        <div className={ `${className}__row__label right` }>рублей</div>
                </div>
                <div className={ `${className}__row` }>
                    <div className={ `${className}__row__label left` }>Срок сделки:</div>
                    <input 
                        className={ `${className}__row__input` }  
                        type='text' 
                        value={ this.creditDuration }
                        onChange={ (event) => this.handleInputChange(event.target.value, EnumInputName.CREDIT_DURATION) } />
                    <div className={ `${className}__row__radio` }>
                        <div 
                            className={ `${className}__row__radio__button ${creditDurationType === EnumCreditDurationType.MONTH ? 'selected' : ''}` }
                            onClick={ () => this.handleCreditDurationTypeChange(EnumCreditDurationType.MONTH) }>
                            <div className={ `${className}__row__radio__button__marker` }>
                                <div className={ `${className}__row__radio__button__dot` } />
                            </div>
                            <div className={ `${className}__row__radio__button__label` }>месяцы</div>
                        </div>
                        <div 
                            className={ `${className}__row__radio__button ${creditDurationType === EnumCreditDurationType.YEAR ? 'selected' : ''}` }
                            onClick={ () => this.handleCreditDurationTypeChange(EnumCreditDurationType.YEAR) }>
                            <div className={ `${className}__row__radio__button__marker` }>
                                <div className={ `${className}__row__radio__button__dot` } />
                            </div>
                            <div className={ `${className}__row__radio__button__label` }>годы</div>
                        </div>
                    </div>
                </div>
                <div className={ `${className}__row` }>
                    <div className={ `${className}__row__label left` }>Процентная ставка:</div>
                    <input 
                        className={ `${className}__row__input` }  
                        type='text'
                        value={ this.creditRate }
                        onChange={ (event) => this.handleInputChange(event.target.value, EnumInputName.CREDIT_RATE) } />
                    <div className={ `${className}__row__label right` }>%</div>
                </div>
                <button className={ `${className}__button-calculate ${isButtonCalculateDisabled ? 'disabled' : ''}` } onClick={ this.handeButtonCalculateClick }>Рассчитать</button>
                { this.renderSeparator() }
                { this.renderCalculationResult() }
            </div>
        )
    }
}

export default Calculator;