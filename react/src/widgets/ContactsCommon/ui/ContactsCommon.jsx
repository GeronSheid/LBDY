import React from "react";
import copy from "copy-to-clipboard";

const ContactItem = (props) => {
    const { title, titleshown, text, href, to_copy} = props;    

    const handleCopy = () => {
        copy(text);
    };

    return (
        <div className="contacts__mobile">
            <div className="contacts__title">{title}</div>
            <div className="contacts__text">
                {href ? (
                    to_copy ? (
                        <a href={href} 
                        onClick={handleCopy}                    
                        title={`Нажмите, чтобы скопировать ${titleshown}`}>
                        {text}
                        </a>
                    ) : (
                        <a href={href}>
                        {text}
                        </a>
                    )
                ) : (
                <span>{text}</span>
                )}
            </div>
        </div>
    );
};

const PolicyLinkItem = (props) => {
        const { text, href, target } = props;
        return (
            <span className="contacts__policy">
                <a href={href} target={target}>{text}</a>
            </span>
        );
    };

const contactItemsArray = [
        {
            title: "ИП",
            titleshown: "ИП",
            text: "Русанов Эрик Андреевич",
            to_copy: false
        },
        {
            title: "ИНН",
            titleshown: "ИНН",
            text: "531802433740",
            href: "#",
            to_copy: true
        },
        {
            title: "Почта",
            titleshown: "адрес",
            text: "info@lbdy.ru",
            href: "mailto:info@lbdy.ru",
            to_copy: false
        },
        {
            title: "Телефон",
            titleshown: "телефон",
            text: "+7 (985) 251-92-52",
            href: "tel:+79852519252",
            to_copy: false
        },
    ];
const policyLinksArray = [
        {
            text: "Политика конфиденциальности",
            href: "https://s3-storage.lbdy.ru/docs/privacy.pdf",
            target: '_blank'
        },
        {
            text: "Пользовательское соглашение",
            href: "https://s3-storage.lbdy.ru/docs/personal_data_processing.pdf",
            target: '_blank'
        },
        {
            text: "Договор оферты",
            href: "https://s3-storage.lbdy.ru/docs/contract_offer.pdf",
            target: '_blank'
        },
    ];

export const ContactItems = () => {
    return(<div className="contacts__info">
        {contactItemsArray.map((item, index) => (
            <ContactItem
                key={index}
                title={item.title}
                titleshown={item.titleshown}
                text={item.text}
                href={item.href}
                to_copy={item.to_copy}
            />
        ))}
    </div>);
}; 

export const FirstContactItems = () => {
const firstContactItems = contactItemsArray.slice(0, 2);

return (
    <div className="contacts__info">
    {firstContactItems.map((item, index) => (
        <ContactItem
        key={index}
        title={item.title}
        titleshown={item.titleshown}
        text={item.text}
        href={item.href}
        to_copy={item.to_copy}
        />
    ))}
    </div>
);
};

export const SecondContactItems = () => {
const secondContactItems = contactItemsArray.slice(2, 4);

return (
    <div className="contacts__info">
    {secondContactItems.map((item, index) => (
        <ContactItem
        key={index}
        title={item.title}
        titleshown={item.titleshown}
        text={item.text}
        href={item.href}
        to_copy={item.to_copy}
        />
    ))}
    </div>
    )
};

export const PolicyItems = () => {
    return (<div className="contacts__policy-wrap">
        {policyLinksArray.map((item, index) => (
            <PolicyLinkItem
                key={index}
                text={item.text}
                href={item.href}
                target={item.target}
            />
        ))}
    </div>);
};