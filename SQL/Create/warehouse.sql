create table warehouse
(
    warehouseid[int] not null identity(1,1) primary key,
    warehousename[varchar](40) not null,
    icestore[char] not null default '1'
)