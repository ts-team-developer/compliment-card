import { makeStyles } from "@material-ui/core";
import './font.css';

export const usePcStyles = makeStyles({
    pcTopBanner : {
      fontFamily : 'NanumSquare !important',
      fontSize : 'medium'
    },
    mobileTopBanner : {
        fontFamily : 'NanumSquare !important',
        fontSize : '15px'
    },
    descriptions: {
        paddingBottom: '10px'
    },
    title: {
        fontFamily : 'NanumSquare !important',
        marginBottom: '20px',
        paddingBottom: '30px',
        fontWeight : 'bold'
    },
    noShow : {
        display : 'none'
    },
    blocks: {
        display : 'block'
    },
    inlineBlock : {
        display : 'inline-block'
    },
    flex : {
        display : 'flex'
    },
    logo : {
        display : 'inline-block',
        lineHeight : '53px',
        verticalAlign : 'middle',
    },
    profile : {
        position : 'absolute',
        right : 0
    },
    pcSearchForm : {

    },
    mobileSearchForm : {

    },
    card : {
        padding: '50px'
    },
    cardTop : {
        borderBottom : '1px solid #eee',
        paddingBottom : '30px',
        marginBottom: '30px'
    },
    cardContent : {
        padding : 0,
        marginTop: "20px"
    },
    
    link : {
        textDecoration : 'none',
        cursor : 'pointer'
    },
    formButton : {
        float : 'right'
    },
    searchEl : {
    },
    p0 : {
        padding : 0
    },
    searchForm : {
        marginBottom : '20px'
    },
    fullWidth: {
        width: '100%'
    },
    titleb0 : {
        paddingBottom : '0'
    }
});

export const useMobileStyles = makeStyles({
    pcTopBanner : {
      fontFamily : 'NanumSquare !important',
      fontSize : 'medium'
    },
    mobileTopBanner : {
        fontFamily : 'NanumSquare !important',
        fontSize : '15px'
    },
    title: {
        fontFamily : 'NanumSquare !important',
        marginBottom: '20px'
    },
    descriptions: {
        paddingBottom: '10px'
    },
    noShow : {
        display : 'none'
    },
    blocks: {
        display : 'block'
    },
    inlineBlock : {
        display : 'inline-block'
    },
    flex : {
        display : 'flex',
        padding : '0px, 5px'
    },
    logo : {
        display : 'inline-block',
        lineHeight : '53px',
        verticalAlign : 'middle',
    },
    profile : {
        position : 'absolute',
        right : 0
    },
    card : {
        padding: '10px'
    },
    cardTop : {
        borderBottom : '1px solid #eee',
        padding : '10px',
        marginBottom: '30px'
    },
    cardContent : {
        marginTop: "20px"
    },
    searchEl : {
        paddingBottom : '5px',
        fontSize : '0.8rem'
    },
    fullWidth: {
        width: '100%'
    }
});