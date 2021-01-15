create table customer
(
    customerid[int] not null identity(1,1) primary key,
    customername[varchar](40) not null,
    customerprovince[char](2) not null,
    customerarea[char](2) not null,
    customercity[char](2) not null,
    customertown[char](6) not null,
    customeraddr[varchar](100) not null default '',
    createdate[date] not null default getdate(),
    del_falg[char] not null default 'N'
)