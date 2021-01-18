create table customercontact
(
    customercontactid[int] not null identity(1,1) primary key,
    customerid[int] not null foreign key (customerid) references customer(customerid),
    contactpersonname[varchar](10) not null,
    sex[char] not null default 'M',
    agegroup[char] not null default '2',
    liqueur[char] not null default 'Y',
    smoke[char] not null default 'N',
    sing[char] not null default 'N',
    gifts[char] not null default 'N',
    dwell[varchar](50) not null default '',
    del_flag[char] not null default 'N'
)