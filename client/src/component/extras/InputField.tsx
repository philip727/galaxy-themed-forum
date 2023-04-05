import { ChangeEvent } from 'react';
import './InputField.scss'

type Props = {
    placeholder?: string,
    name?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    width?: string,
}

export default function InputField({ placeholder, name, onChange, type, width}: Props) {
    width ??="w-96" 

    return (
        <div className={`${width} h-12 bg-[var(--dark-jet)] flex flex-col`}>
            <input name={name} placeholder={placeholder} onChange={onChange} type={type} className="w-full h-full bg-[rgba(0,0,0,0)] px-4 input-field"/>
            <span className="bg-[var(--blue-violet)] h-[2px] w-full transition-colors duration-300"/>
        </div>
    )
}
