create table productformat
(
    productformatid[int] not null identity(1,1) primary key,
    productid[int] not null foreign key (productid) references product(productid),
    width[int] not null default 0,
    height[int] not null default 0,
    vol[int] not null default 0,
    defaultduration[int] not null default 14,
    official[char] not null default '0'
)