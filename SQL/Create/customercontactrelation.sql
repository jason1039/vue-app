create table customercontactrelation
(
    customerrelationid[int] not null identity(1,1) primary key,
    customercontactid[int] foreign key (customercontactid) references customercontact(customercontactid),
    relationcontent[varchar](200) not null default '',
    relationdate[date] not null default getdate(),
    del_falg[char] not null default 'N'
)