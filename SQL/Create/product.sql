create table product
(
    productid[int] not null identity(1,1) primary key,
    productname[varchar](20) not null,
    parting[char] not null default '1',
    volume[char] not null default '0'
)