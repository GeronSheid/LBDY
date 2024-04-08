import { Sidebar } from "widgets/Sidebar";
import './sass/knowlegeBase.scss'
import { KnowlegeBaseFilter } from "widgets/KwonlegeBaseFilter";
import { Suspense, useEffect, useState } from "react";
import { KnowlegeBase } from "features/KnowlegeBase";
import { TabBar } from "widgets/TabBar";
import useWindow from "shared/hooks/useWindow";
import { Header } from "widgets/Header";
import Spiner from "shared/assets/img/spinner.svg";

const KnowledgeBasePage = () => {
    const [querryParams, setQuerryParams] = useState({})
    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;
    const [openSearchModal, setOpenSearchModal] = useState(false)
    useEffect(() => {
        document.title = 'Элбади - База знаний'
    }, [])

    return (
        <>
            <div className='main-container'>
                {!isMobile && <Sidebar />}
                {!isMobile &&
                    <>
                        <KnowlegeBaseFilter
                            className='knowlegeBase__filters'
                            getQuerryParams={setQuerryParams}
                            openSearchModal={openSearchModal}
                            setOpenSearchModal={setOpenSearchModal}
                        />
                        <Suspense fallback={<Spiner />}>
                            <KnowlegeBase querryParams={querryParams} />
                        </Suspense>
                    </>
                }
                {isMobile &&
                    <div className="main-container__modal-wrap">
                        <KnowlegeBaseFilter
                            className='knowlegeBase__filters'
                            getQuerryParams={setQuerryParams}
                            isMobile={true}
                            openSearchModal={openSearchModal}
                            setOpenSearchModal={setOpenSearchModal}
                        />
                        <Header title='База знаний' />
                        <Suspense fallback={<Spiner />}>
                            <KnowlegeBase
                                querryParams={querryParams}
                                openSearchModal={openSearchModal}
                                setOpenSearchModal={setOpenSearchModal}
                                isMobile={isMobile} />
                        </Suspense>
                    </div>
                }
            </div>
            {isMobile && <TabBar />}
        </>
    );
};

export default KnowledgeBasePage;
