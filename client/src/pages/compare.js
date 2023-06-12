import {useEffect, useState} from "react";
import Link from "next/link";
import styles from '@/styles/Algorithms.module.css'
import {useFormInput} from "@/utils/hooks";
import NavigationTree from "@/components/NavigationTree";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from "next-export-i18n";

const Compare = ({algorithms}) => {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (query) {
            setLanguage(query.lang)
        }
    }, [query])

    return (
        <div className="page-template">

            <nav className="breadcrumb-container" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href={{pathname: "/", query: query}}>{t('pages.main')}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">{t('pages.algorithms_compare')}</li>
                </ol>
            </nav>

            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%"}}>
                <div>

                </div>

                <div>

                </div>
            </div>

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
    )
}

export default Compare;

export async function getStaticProps(context) {

    const resAlgo = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await resAlgo.json()

    return {
        props: {algorithms}, // will be passed to the page component as props
    }
}

