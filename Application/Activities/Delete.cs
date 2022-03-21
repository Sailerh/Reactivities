using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly  DataContext _context;

            public Handler(DataContext context)
            {     
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activit = await _context.Activities.FindAsync(request.Id);
                if(activit != null)
                {
                    // _context.Activities.Remove(activit);
                    _context.Remove(activit);

                    await _context.SaveChangesAsync();
                }

                return Unit.Value;
            }
        }
    }
}