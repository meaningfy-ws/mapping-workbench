#!/usr/bin/python3

# notice_packager.py
# Date:  14/03/2022
# Author: Kolea PLESCO
# Email: kalean.bl@gmail.com

"""
This module provides functionalities to generate bulk/multiple notice packages for test purposes.
"""
import base64
import json
import os
from pathlib import Path
from typing import List

import click
from pymongo import MongoClient

from ted_sws import config
from ted_sws.core.adapters.cmd_runner import CmdRunner as BaseCmdRunner
from ted_sws.core.model.manifestation import XMLManifestation, RDFManifestation
from ted_sws.core.model.notice import Notice, NoticeStatus
from ted_sws.data_manager.adapters.notice_repository import NoticeRepository
from ted_sws.event_manager.adapters.log import LOG_WARN_TEXT
from ted_sws.notice_metadata_processor.services.xml_manifestation_metadata_extractor import \
    XMLManifestationMetadataExtractor
from ted_sws.notice_packager.services.metadata_transformer import MetadataTransformer, DENORMALIZED_SEPARATOR, \
    NORMALIZED_SEPARATOR
from ted_sws.notice_packager.services.notice_packager import package_notice

CMD_NAME = "CMD_BULK_PACKAGER"
DEFAULT_FILES_COUNT: int = 3000


class PackageNotice(Notice):
    ted_id: str = 'fake-notice-id'

    def __init__(self, **data):
        super().__init__(**data)
        self.set_xml_manifestation(xml_manifestation=XMLManifestation(
            object_data='<?xml version="1.0" encoding="UTF-8"?><TED_EXPORT xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://publications.europa.eu/resource/schema/ted/R2.0.8/publication" xmlns:n2016="http://publications.europa.eu/resource/schema/ted/2016/nuts" xsi:schemaLocation="http://publications.europa.eu/resource/schema/ted/R2.0.8/publication TED_EXPORT.xsd" DOC_ID="426046-2018" EDITION="2018189"><TECHNICAL_SECTION><RECEPTION_ID>18-432813-001</RECEPTION_ID><DELETION_DATE>20190104</DELETION_DATE><FORM_LG_LIST>EN CS DA DE ET EL ES FR IT LV LT HR HU MT NL PL PT SK SL FI SV RO GA BG </FORM_LG_LIST><COMMENTS>From Convertor</COMMENTS></TECHNICAL_SECTION><LINKS_SECTION><XML_SCHEMA_DEFINITION_LINK xlink:type="simple" xlink:href="http://ted.europa.eu" xlink:title="TED WEBSITE"/><OFFICIAL_FORMS_LINK xlink:type="simple" xlink:href="http://ted.europa.eu"/><FORMS_LABELS_LINK xlink:type="simple" xlink:href="http://ted.europa.eu"/><ORIGINAL_CPV_LINK xlink:type="simple " xlink:href="http://ted.europa.eu"/><ORIGINAL_NUTS_LINK xlink:type="simple" xlink:href="http://ted.europa.eu"/></LINKS_SECTION><CODED_DATA_SECTION><REF_OJS><COLL_OJ>S</COLL_OJ><NO_OJ>189</NO_OJ><DATE_PUB>20181002</DATE_PUB></REF_OJS><NOTICE_DATA><NO_DOC_OJS>2018/S 189-426046</NO_DOC_OJS><URI_LIST><URI_DOC LG="EN">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:EN:HTML</URI_DOC><URI_DOC LG="CS">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:CS:HTML</URI_DOC><URI_DOC LG="DA">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:DA:HTML</URI_DOC><URI_DOC LG="DE">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:DE:HTML</URI_DOC><URI_DOC LG="ET">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:ET:HTML</URI_DOC><URI_DOC LG="EL">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:EL:HTML</URI_DOC><URI_DOC LG="ES">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:ES:HTML</URI_DOC><URI_DOC LG="FR">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:FR:HTML</URI_DOC><URI_DOC LG="IT">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:IT:HTML</URI_DOC><URI_DOC LG="LV">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:LV:HTML</URI_DOC><URI_DOC LG="LT">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:LT:HTML</URI_DOC><URI_DOC LG="HR">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:HR:HTML</URI_DOC><URI_DOC LG="HU">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:HU:HTML</URI_DOC><URI_DOC LG="MT">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:MT:HTML</URI_DOC><URI_DOC LG="NL">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:NL:HTML</URI_DOC><URI_DOC LG="PL">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:PL:HTML</URI_DOC><URI_DOC LG="PT">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:PT:HTML</URI_DOC><URI_DOC LG="SK">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:SK:HTML</URI_DOC><URI_DOC LG="SL">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:SL:HTML</URI_DOC><URI_DOC LG="FI">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:FI:HTML</URI_DOC><URI_DOC LG="SV">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:SV:HTML</URI_DOC><URI_DOC LG="RO">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:RO:HTML</URI_DOC><URI_DOC LG="GA">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:GA:HTML</URI_DOC><URI_DOC LG="BG">http://ted.europa.eu/udl?uri=TED:NOTICE:426046-2018:TEXT:BG:HTML</URI_DOC></URI_LIST><LG_ORIG>EN</LG_ORIG><ISO_COUNTRY VALUE="ZM"/><IA_URL_GENERAL/><ORIGINAL_CPV CODE="31321300">High-voltage cable</ORIGINAL_CPV></NOTICE_DATA><CODIF_DATA><DS_DATE_DISPATCH>20180926</DS_DATE_DISPATCH><DT_DATE_FOR_SUBMISSION>20181226</DT_DATE_FOR_SUBMISSION><AA_AUTHORITY_TYPE CODE="4">Utilities entity</AA_AUTHORITY_TYPE><TD_DOCUMENT_TYPE CODE="7">Contract award notice</TD_DOCUMENT_TYPE><NC_CONTRACT_NATURE CODE="1">Works</NC_CONTRACT_NATURE><PR_PROC CODE="1">Open procedure</PR_PROC><RP_REGULATION CODE="2">European Investment Bank, European Investment Fund, European Bank for Reconstruction and Development</RP_REGULATION><TY_TYPE_BID CODE="9">Not applicable</TY_TYPE_BID><AC_AWARD_CRIT CODE="Z">Not specified</AC_AWARD_CRIT><MA_MAIN_ACTIVITIES CODE="Z">Not specified</MA_MAIN_ACTIVITIES><HEADING>BI406</HEADING></CODIF_DATA></CODED_DATA_SECTION><TRANSLATION_SECTION><ML_TITLES><ML_TI_DOC LG="BG"><TI_CY>Замбия</TI_CY><TI_TOWN>Лусака</TI_TOWN><TI_TEXT><P>ЕИБ - Подстанции за високо напрежение</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="CS"><TI_CY>Zambie</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Rozvodny vysokého napětí</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="DA"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Højspændingstransformerstationer</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="DE"><TI_CY>Sambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Hochspannungs-Umspannstationen</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="EL"><TI_CY>Ζάμπια</TI_CY><TI_TOWN>Λουσάκα</TI_TOWN><TI_TEXT><P>ΕΤΕπ - Υποσταθμοί υψηλής τάσης</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="EN"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - High voltage substations</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="ES"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>BEI - Subestaciones de alto voltaje</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="ET"><TI_CY>Sambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIP - Kõrgepingealajaamad</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="FI"><TI_CY>Sambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIP - Suurjännitemuuntoasemat</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="FR"><TI_CY>Zambie</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>BEI - Sous-stations à haute tension</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="GA"><TI_CY>Saimbia, an t</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>BEI - High voltage substations</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="HR"><TI_CY>Zambija</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Egipatski prijenos električne energije</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="HU"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EBB - Nagyfeszültségű alállomások</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="IT"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>BEI - Sottostazioni ad alto voltaggio</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="LT"><TI_CY>Zambija</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Aukštos įtampos pastotės</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="LV"><TI_CY>Zambija</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Augstsprieguma apakšstacijas</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="MT"><TI_CY>iż-Żambja</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>BEI - Stazzjonijiet sekondarji ta’ vultaġġ għoli</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="NL"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Hoogspanningsonderstations</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="PL"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EBI - Podstacje wysokiego napięcia</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="PT"><TI_CY>Zâmbia</TI_CY><TI_TOWN>Lusaca</TI_TOWN><TI_TEXT><P>BEI - Subestações de alta tensão</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="RO"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>BEI - Substaţii de înaltă tensiune</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="SK"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Rozvodne vysokého napätia</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="SL"><TI_CY>Zambija</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Visoko-napetostne razdelilne postaje</P></TI_TEXT></ML_TI_DOC><ML_TI_DOC LG="SV"><TI_CY>Zambia</TI_CY><TI_TOWN>Lusaka</TI_TOWN><TI_TEXT><P>EIB - Högspänningstransformatorstationer</P></TI_TEXT></ML_TI_DOC></ML_TITLES><ML_AA_NAMES><AA_NAME LG="EN">ZESCO Limited</AA_NAME><AA_NAME LG="CS">ZESCO Limited</AA_NAME><AA_NAME LG="DA">ZESCO Limited</AA_NAME><AA_NAME LG="DE">ZESCO Limited</AA_NAME><AA_NAME LG="ET">ZESCO Limited</AA_NAME><AA_NAME LG="EL">ZESCO Limited</AA_NAME><AA_NAME LG="ES">ZESCO Limited</AA_NAME><AA_NAME LG="FR">ZESCO Limited</AA_NAME><AA_NAME LG="IT">ZESCO Limited</AA_NAME><AA_NAME LG="LV">ZESCO Limited</AA_NAME><AA_NAME LG="LT">ZESCO Limited</AA_NAME><AA_NAME LG="HR">ZESCO Limited</AA_NAME><AA_NAME LG="HU">ZESCO Limited</AA_NAME><AA_NAME LG="MT">ZESCO Limited</AA_NAME><AA_NAME LG="NL">ZESCO Limited</AA_NAME><AA_NAME LG="PL">ZESCO Limited</AA_NAME><AA_NAME LG="PT">ZESCO Limited</AA_NAME><AA_NAME LG="SK">ZESCO Limited</AA_NAME><AA_NAME LG="SL">ZESCO Limited</AA_NAME><AA_NAME LG="FI">ZESCO Limited</AA_NAME><AA_NAME LG="SV">ZESCO Limited</AA_NAME><AA_NAME LG="RO">ZESCO Limited</AA_NAME><AA_NAME LG="GA">ZESCO Limited</AA_NAME><AA_NAME LG="BG">ZESCO Limited</AA_NAME></ML_AA_NAMES></TRANSLATION_SECTION><FORM_SECTION><OTH_NOT CATEGORY="ORIGINAL" LG="EN" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="CS" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="DA" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="DE" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="ET" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="EL" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="ES" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="FR" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="IT" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="LV" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="LT" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="HR" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="HU" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="MT" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="NL" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="PL" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="PT" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="SK" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="SL" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="FI" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="SV" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="RO" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="GA" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT><OTH_NOT CATEGORY="TRANSLATION" LG="BG" VERSION="R2.0.8.S04.E01"><FD_OTH_NOT><TI_DOC><P>EIB - High voltage substations (ZM-Lusaka)</P></TI_DOC><STI_DOC><P>Award notice</P></STI_DOC><CONTENTS><P>Project title: Lusaka Power Transmission and Distribution Network</P><P>Project number: 2012-0602</P><P>Lot title: Procurement of 2 Substations and Associated Switching Stations in 2 lots – Lot 2: Chawama 132/11 kV</P><P>Publication reference: OJ/S S101 – 200031-2017</P><P>Publication date of the procurement notice: 27.5.2017</P><P>Promoter’s name: <ADDRESS_NOT_STRUCT><ORGANISATION>ZESCO Limited</ORGANISATION><BLK_BTX>, </BLK_BTX><TOWN>Lusaka</TOWN><BLK_BTX>, ZAMBIA</BLK_BTX></ADDRESS_NOT_STRUCT></P><P>Contract value: 10 768 794,05 USD</P><P>Date of award of contract: 20 September 2018</P><P>Number of bids received: 21</P><P>Name of successful bidder: Sieyuan Electric Co. Ltd in Joint Venture with Techno electric Engineering Co., Limited, Sieyuan No. 4399 Jindu road, MinhangDist, Shangai — China.</P></CONTENTS></FD_OTH_NOT></OTH_NOT></FORM_SECTION></TED_EXPORT>'
        ))


class CmdRunner(BaseCmdRunner):
    def __init__(self, rdf_files_folder, output_folder, pkgs_count: int, notice_ids: List = None,
                 mongodb_client=MongoClient(config.MONGO_DB_AUTH_URL)):
        super().__init__(name=CMD_NAME)
        self.output_path = Path(os.path.realpath(output_folder))
        self.notices = None
        if notice_ids:
            self.log(LOG_WARN_TEXT.format("Notices: ") + str(notice_ids))
            self.notice_repository = NoticeRepository(mongodb_client=mongodb_client)
            self.notices = []
            for notice_id in notice_ids:
                self.notices.append(self.notice_repository.get(reference=notice_id))
        else:
            self.rdf_files_path = Path(os.path.realpath(rdf_files_folder))
            self.pkgs_count = pkgs_count
            if not self.rdf_files_path.is_dir():
                error_msg = f"No such folder :: [{rdf_files_folder}]"
                self.log_failed_msg(error_msg)
                raise FileNotFoundError(error_msg)

        self.output_path.mkdir(parents=True, exist_ok=True)

    def run_cmd(self):
        error = None
        try:
            if self.notices:
                self.log("Saving packages to " + str(self.output_path))
                for notice in self.notices:
                    package_notice(notice=notice)
            else:
                rdf_files = [Path(str(f_path)) for f in os.listdir(self.rdf_files_path) if
                             os.path.isfile(f_path := os.path.join(self.rdf_files_path, f))]
                rdf_files_count = len(rdf_files)
                base_idx = 100000
                year = 2021

                for i in range(self.pkgs_count):
                    rdf_idx = i % rdf_files_count
                    rdf_file_path = rdf_files[rdf_idx]
                    notice_id = str(base_idx + i) + "_" + str(year)
                    self.generate_package(notice_id, self.output_path, rdf_file_path)
        except Exception as e:
            error = e

        return self.run_cmd_result(error)

    @classmethod
    def generate_package(cls, notice_id, output_path, rdf_file_path):

        with open(rdf_file_path, "r") as f:
            rdf_content = f.read()
            encoded_rdf_content = base64.b64encode(bytes(rdf_content, 'utf-8'))

            notice = PackageNotice(ted_id=notice_id)
            notice._status = NoticeStatus.VALIDATED
            notice.set_rdf_manifestation(RDFManifestation(object_data=encoded_rdf_content))
            notice.set_distilled_rdf_manifestation(RDFManifestation(object_data=encoded_rdf_content))
            notice._status = NoticeStatus.ELIGIBLE_FOR_PUBLISHING
            package_notice(notice)


def run(rdf_files_folder=None, output_folder=None, pkgs_count=None, notice_id=None,
        mongodb_client=MongoClient(config.MONGO_DB_AUTH_URL)):
    cmd = CmdRunner(rdf_files_folder, output_folder, pkgs_count, list(notice_id or []), mongodb_client)
    cmd.run()


@click.command()
@click.argument('rdf-files-folder', nargs=1, required=False)
@click.argument('pkgs-count', nargs=1, type=click.INT, required=False, default=DEFAULT_FILES_COUNT)
@click.option('--output-folder', required=False, default=".")
@click.option('--notice-id', required=False, multiple=True, default=None)
def main(rdf_files_folder, pkgs_count, output_folder, notice_id):
    """
    Generates test METS packages
    """
    run(rdf_files_folder, output_folder, pkgs_count, notice_id)


if __name__ == '__main__':
    main()
