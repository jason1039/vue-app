create table customercontactnumbers
(
    customercontactnumberid[int] not null identity(1,1) primary key,
    customercontactid[int] not null foreign key (customercontactid) references customercontact(customercontactid),
    customercontactnumber[varchar](20) not null,
    del_flag[char] not null default 'N'
)