import { ChangeEvent } from 'react';
import './InputField.scss'

type Props = {
    placeholder?: string,
    name?: string,
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    className?: string,
    maxLength?: number,
    reference?: any,
    areaClassName?: string,
    defaultValue?: string,
}

export default function InputArea({ reference, maxLength,  placeholder, name, onChange, className, areaClassName, defaultValue }: Props) {
    className ??= "w-96"

    return (
        <div className={`${className} h-12 bg-[var(--dark-jet)] flex flex-col`}>
            <textarea 
                ref={reference} 
                name={name} 
                placeholder={placeholder} 
                maxLength={maxLength} 
                onChange={onChange} 
                className={`resize-none w-full h-full bg-[rgba(0,0,0,0)] px-4 input-field ${areaClassName}`} 
                defaultValue={defaultValue}
            />
            <span className="bg-[var(--blue-violet)] h-[2px] w-full transition-colors duration-300" />
        </div>
    )
}
