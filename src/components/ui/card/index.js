import styled from 'styled-components'

export const Card = styled.div.attrs(()=>({
    className: 'card'
}))``

export const CardBody = styled.div.attrs(()=>({
    className: 'card-body'
}))`
    overflow: auto;
    height: 110px;
`

export const CardFooter = styled.div.attrs(()=>({
    className: 'card-footer'
}))``

export const CardTitle = styled.h3.attrs(()=>({
    className: 'card-title'
}))`
    overflow: hidden;
    padding-right: 10px;
`

export const CardHead = styled.div.attrs(()=>({
    className: 'card-header'
}))`
    overflow: hidden;

`

export const CardOptions = styled.div.attrs(()=>({
    className: 'card-options'
}))``
