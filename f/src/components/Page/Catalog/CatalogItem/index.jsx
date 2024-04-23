import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { inFinalState, inInitialState } from '@/store/helpers'
import { useTemplateContext } from '@/contexts/TemplateContext'
import { getCurrentRegion } from '@/components/Header/Regions'
import { fetchCatalogItem } from '@store'
import { Fancybox } from "@fancyapps/ui";
import {Routes, Route, Redirect, useHistory} from 'react-router-dom'

import './style.scss'
import NotFoundPage from '@components/Page/NotFoundPage'
import { Link } from 'react-router-dom'
import ClinicalGallery from './ClinicalGallery'
import videoModals from '../../../../hooks/videoModals'
import { updatePageMeta } from '../../../../hooks/usePageMeta'

const catalogClassName = 'catalog-detail'

const CatalogItemPage = props => {

  const [sticky, setSticky] = useState({});

  const lang = useTemplateContext().lang;
  let catalogItemCode = props.match.params.path1
  if (props.match.params.path2) {
    catalogItemCode += '/' + props.match.params.path2
  }
  if (props.match.params.path3) {
    catalogItemCode += '/' + props.match.params.path3
  }
  if (props.match.params.path4) {
    catalogItemCode += '/' + props.match.params.path4
  }
  const region = getCurrentRegion()
  const dispatch = useDispatch()
  const catalogItemsStoreChunk = useSelector(store => store['catalogItem'][catalogItemCode])
  videoModals(catalogItemCode)



  

  useEffect(() => {
    if (
      !location.pathname.includes('/en/') &&
      location.pathname.includes('ultrasound-diagnostics') &&
      (location.pathname.match(/\//g) || []).length > 3 &&
      !location.pathname.includes('productivity') &&
      !location.pathname.includes('imaging') &&
      !location.pathname.includes('advanced-applications') &&
      !location.pathname.includes('advanced_applications') &&
      (location.pathname.includes('a450') ||
       location.pathname.includes('a550') ||
       location.pathname.includes('200g') ||
       location.pathname.includes('100g'))
    ) {
      window.location.replace(location.pathname + '/imaging');
    } else if (
      location.pathname.includes('/en/') &&
      location.pathname.includes('ultrasound-diagnostics') &&
      (location.pathname.match(/\//g) || []).length > 4 &&
      !location.pathname.includes('productivity') &&
      !location.pathname.includes('imaging') &&
      !location.pathname.includes('advanced-applications') &&
      !location.pathname.includes('advanced_applications') &&
      (location.pathname.includes('a450') ||
       location.pathname.includes('a550') ||
       location.pathname.includes('200g') ||
       location.pathname.includes('100g'))
    ) {
      window.location.replace(location.pathname + '/imaging');
    }
  }, []);

  const history = useHistory()
  useEffect(() => {
    if (location.pathname.endsWith("angiography") || location.pathname.endsWith("angiography/")) {
      let newUrl = location.pathname
      if (newUrl.endsWith("/")) {
        newUrl = newUrl.slice(0, -1);
      }
      history.push(`${newUrl}/alphenix/`)
      dispatch(fetchCatalogItem('angiography/alphenix', region, lang))
    }
  })

  useEffect(() => {
    if (window.location.pathname.includes("angiography")) {
      setSticky({ position: "sticky", zIndex: "1", top: "-1px", background: "white"});
    } else {
      setSticky({});
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (!catalogItemsStoreChunk || inInitialState(catalogItemsStoreChunk)) {
      dispatch(fetchCatalogItem(catalogItemCode, region, lang))
    }
    document.documentElement.scrollTop = 0
    Fancybox.bind("[data-fancybox]", {
      on: {
        "done": (fancybox, slide) => {
          if (slide.triggerEl.classList.contains('image-points__p')) {
            let title = slide.triggerEl.dataset.title,
              descr = slide.triggerEl.dataset.descr;
              
            document.querySelector('.points-popup__title').innerHTML = title;
            document.querySelector('.points-popup__descr').innerHTML = descr;
          }
        },
      }
    });
  }, [dispatch, catalogItemsStoreChunk])

  if (!inFinalState(catalogItemsStoreChunk)) {
    return null
  }
  const { data: catalogItem } = catalogItemsStoreChunk

  if (catalogItem) {
    catalogItem.menu.forEach(item => {
      if (location.pathname === item.link) {
        item.active = true
      } else if (location.pathname.includes('imaging')) {
        catalogItem.menu[1].active = true
      }
    })

    updatePageMeta(catalogItem.seo)

    const flagTabs = catalogItem.disable_tabs;
    const twoBanner = catalogItem.two_banner;

    return (
        <div className={`flex-column ${catalogClassName} ${twoBanner ? '--no-pb' : ' '}`}>
          <div className="container sticky" style={sticky}>
            <h1 dangerouslySetInnerHTML={{__html: catalogItem.name}}/>
            {
              <div className="wrapper" >
                {catalogItem.menu &&
                    <div className="tabs">
                      {location.pathname.includes("ultrasound-diagnostics") && (location.pathname.includes('aplio-a-series') || location.pathname.includes('xario-g-series')) ?
                          catalogItem.menu.map((item, index) => (

                              (catalogItem.depth != '3' && item.name !== 'About' && item.name !== 'О продукте' && catalogItem.parentSectionName !== 'Aplio i-series') ?
                                  <Link key={index} to={item.link}>
                                    <div className={'tab ' + (item.active ? 'active' : '')}>
                                      {item.image?.src ? <img alt="" src={item.image?.src}/> : ''}
                                      {item.name}
                                    </div>
                                  </Link> : catalogItem.code !== 'i-series-prism' && catalogItem.code !== 'aplio-i-series' && catalogItem.depth == '3' && item.name !== 'About' && item.name !== 'О продукте' ?
                                      (
                                          <Link key={index} to={item.link + 'imaging/'}>
                                            <div className={'tab ' + (item.active ? 'active' : '')}>
                                              {item.image?.src ? <img alt="" src={item.image?.src}/> : ''}
                                              {item.name}
                                            </div>
                                          </Link>) : catalogItem.code === 'i-series-prism' || catalogItem.code === 'aplio-i-series' && catalogItem.depth == '3' && item.name !== 'About' && item.name !== 'О продукте' ?
                                          (
                                              <Link key={index} to={item.link}>
                                                <div className={'tab ' + (item.active ? 'active' : '')}>
                                                  {item.image?.src ? <img alt="" src={item.image?.src}/> : ''}
                                                  {item.name}
                                                </div>
                                              </Link>
                                          ) : null
                          )) :
                          catalogItem.menu.map((item, index) => (
                              <Link key={index} to={item.link}>
                                <div className={'tab ' + (item.active ? 'active' : '')}>
                                  {item.image?.src ? <img alt="" src={item.image?.src}/> : ''}
                                  {item.name}
                                </div>
                              </Link>))
                      }
                    </div>
                }
              </div>
            }

          </div>
          <div className="container">

            {catalogItem.previewImage?.src ?
                <div className="wrapper">
                  <img alt={catalogItem.name}
                       className="topImage"
                       src={catalogItem.previewImage.src}
                       width={catalogItem.previewImage.w}
                       height={catalogItem.previewImage.h}/>
                </div> :
                ''}

            {twoBanner ?
                <div className="container catalog-detail__extra --top">
                  {catalogItem.detailText &&
                      <div className="wrapper" dangerouslySetInnerHTML={{__html: catalogItem.detailText}}/>}
                </div>
                : null
            }
          </div>
          {catalogItem.medialibrary && <ClinicalGallery flagTabs={flagTabs} items={catalogItem.medialibrary}/>}

          {!twoBanner ?
              <div className="container catalog-detail__extra">
                {catalogItem.detailText &&
                    <div className="wrapper" dangerouslySetInnerHTML={{__html: catalogItem.detailText}}/>}
              </div>
              : null
          }


        </div>
    )
  }

  return <NotFoundPage />
}

export default CatalogItemPage