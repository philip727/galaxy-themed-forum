import { ChangeEvent } from 'react';
import './InputField.scss'

type Props = {
    placeholder?: string,
    name?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    className?: string,
    maxLength?: number,
}

export default function InputField({ placeholder, name, onChange, type, className, maxLength }: Props) {
    className ??="w-96" 

    return (
        <div className={`${className} h-12 bg-[var(--dark-jet)] flex flex-col`}>
            <input name={name} placeholder={placeholder} onChange={onChange} type={type} maxLength={maxLength} className="w-full h-full bg-[rgba(0,0,0,0)] px-4 input-field"/>
            <span className="bg-[var(--blue-violet)] h-[2px] w-full transition-colors duration-300"/>
        </div>
    )
}
